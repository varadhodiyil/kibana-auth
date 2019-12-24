/**
 * @author  
 *
 * Adds the server API to an existing Hapi server object.
 */

const Jade = require('pug');
const Path = require('path');
const Config = require('../config');
const TwoFactor = require('../authentication/twofactor');
const Authentication = require('../authentication/auth');
const Logger = require('../logger');
const Request = require('request');
var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


function url(resource) {
    return 'http://127.0.0.1:9200' + resource;
}

module.exports = {

    /**
     * Adds routing for a Hapi server to implement the 'Server API'.
     *
     * @param server Hapi server to register routes on.
     */
    register: async function (server) {
        let basePath = server.config().get('server.basePath');
        //server.route.options.security = true;

        server.route({
            method: 'POST',
            path: '/logout',

            handler(request, h) {
                h.response().header('max-age', '15552000');
                return h.response().unstate(cookieName(), cookie()).code(200);
            }
        });

        server.route({
            method: 'GET',
            path: '/customlogin',
            config: { auth: false },

            handler(request, h) {
                return Jade.renderFile(
                    Path.resolve(__dirname, '../../public/customlogin.pug'), {
                        'kbnVersion': Config.version(),
                        'basePath': basePath
                    });
            }
        });
 
        server.route({
            method: 'GET',
            path: '/requestaccess',
            config: { auth: false },

            handler(request, h) {
                return Jade.renderFile(
                    Path.resolve(__dirname, '../../public/requestaccess.pug'), {
                        'kbnVersion': Config.version(),
                        'basePath': basePath
                    });
            }
        });

        


        server.route({
            method: 'POST',
            path: '/creategroup',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                console.log("data", data)

                return new Promise((resolve, reject) => {
                    esclient.exists({
                        id: data.name,                              
                        index: 'customgroups',
                    }).then(function(exists) {
                        console.log(exists)

                        if(exists) {
                            resolve({error: "group name already exists"})
                        } else {
                            esclient.create({
                                id: data.name,                              
                                index: 'customgroups',
                                body: {
                                    name: data.name,
                                    levels: []
                                }
                            }).then(function(result) {
                                resolve({error: "success"})
                            })
                        }
                    })
                })
            }
        })

        
        server.route({
            method: 'POST',
            path: '/deletegroup',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                console.log("data", data)

                return new Promise((resolve, reject) => {
                    esclient.exists({
                        id: data.name,                              
                        index: 'customgroups',
                    }).then(function(exists) {
                        console.log(exists)

                        if(exists) {
                            esclient.delete({
                                id: data.name,                              
                                index: 'customgroups',
                            }).then(function(result) {
                                resolve({error: "success"})
                            })
                        } else {
                            resolve({error: "group name already deleted"})
                        }
                    })
                })
            }
        })
        server.route({
            method: 'POST',
            path: '/updategrouplevels',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                console.log("data", data)

                return new Promise((resolve, reject) => {
                    esclient.exists({
                        id: data.name,                              
                        index: 'customgroups',
                    }).then(function(exists) {
                        console.log("customgroups exists", exists)

                        if(exists) {
                            
                            esclient.update({
                                id: data.name,                              
                                index: 'customgroups',
                                body: {
                                    "doc" : {
                                        "name" : data.name,
                                        "levels": data.levels,
                                        "dashboards": data.dashboard
                                    }
                                }
                            }).then(function(result) {
                                console.log("result", result)
                                resolve({error: "success"})
                            })
                        } else {
                            resolve({error: "group does not exists to update levels"})
                        }
                    })
                })
            }
        })

        
        server.route({
            method: 'POST',
            path: '/linkUser',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                console.log("data", data)

                return new Promise((resolve, reject) => {
                    esclient.exists({
                        id: data.username,                              
                        index: 'customusers',
                        
                    }).then(function(exists) {
                        console.log("linkUser", exists)

                        if(exists) {
                            esclient.update({
                                id: data.username,                              
                                index: 'customusers',
                                body: {
                                    "doc" : {
                                        "isLinked" : true,
                                        "group" : data.group,
                                        "level" : data.level
                                    }
                                }
                                    
                            }).then(function(result) {
                                resolve({error: "success"})
                            })
                        } else {
                            resolve({error: "User does not exists to link"}) 
                        }
                    })
                })
            }
        })

        
        server.route({
            method: 'POST',
            path: '/unlinkUser',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                console.log("data", data)

                return new Promise((resolve, reject) => {
                    esclient.exists({
                        id: data.username,                              
                        index: 'customusers',
                        
                    }).then(function(exists) {
                        console.log(exists)

                        if(exists) {
                            esclient.update({
                                id: data.username,                              
                                index: 'customusers',
                                body:  {
                                    "doc" : {
                                        "isLinked" : false,
                                        "group" : "",
                                        "level" : ""
                                    }
                                }
                            }).then(function(result) {
                                resolve({error: "success"})
                            })
                        } else {
                            resolve({error: "User does not exists to unlink"}) 
                        }
                    })
                })
            }
        })

        server.route({
            method: 'GET',
            path: '/getcustomsettings',

            handler(request, h) {
                return new Promise((resolve, reject) => {
                    esclient.search({
                        index: "customusers",
                        body: {
                            "query": {
                                "match_all": {}
                            }
                        }
                    }).then(function(customusers){
                        console.log('customusers', customusers)
                        esclient.search({
                            index: "customgroups",
                            body: {
                                "query": {
                                    "match_all": {}
                                }
                            }
                        }).then(function(customgroups){
                            console.log('customusers', customusers)
                            resolve({ groups: {"customusers": customusers, "customgroups": customgroups} });
                        });
                    })
                })
            }
        });



        server.route({
            method: 'POST',
            path: '/requestaccess',
            config: { auth: false },
            handler(request, h) {
                const username = request.payload.username;
                const password = request.payload.password;
                // console.log("password", password) 
                // 
                // Request.post(url('/api/saved_objects/api/saved_objects/visualization'))
                // .send({
                //   attributes: {
                //     title: 'My favorite vis'
                //   }
                // })
                // .on('response', (response) => {
                //     console.log(response.statusCode);
                //     console.log("yeshbody", response.body);
                // })
                
                // return async function (server, request, h) {
                //     const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
                //     const clusterInfo = await callWithRequest(request, 'cluster.health').then(response => {
                //       console.log(`cluster status is: ` + response.status);
                //       return response
                //     })
                    
                    
                // }
                
                // const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
                // callWithRequest(request, 'cluster').then(response => {
                //     console.log(`cluster status is: ` + JSON.stringify(response));
                //     return response
                // })

                // callWithRequest(request, 'cluster.health').then(response => {
                //     console.log(`cluster status is: ` + JSON.stringify(response));
                //     return response
                // })
                // const adminCluster = server.plugins.elasticsearch.getCluster('admin');
                // adminCluster.callWithInternalUser('ping').then(response => {
                //     console.log(`cluster status is: ` + JSON.stringify(response));
                //     return response
                // });

                // adminCluster.callWithRequest(request, 'cluster.state', {
                //     metric: 'metadata',
                //     index: "admin"
                //   }).then(function (response) {
                //       console.log(" adminCluster: ", response.metadata)
                //     reply(response.metadata.indices["admin"]);
                //   });


                
                // Request.get(url('/data'))
                // .on('response', (response) => {
                //     console.log("testindex", response.statusCode);
                //     console.log("testindex", response);
                // })

                return new Promise((resolve, reject) => {
                    Authentication.authenticate(username, password, (err, user) => {
                        // console.log("user", user)
                        // console.log("err", err)
                        if (err || !user) {
                            Logger.failedAuthentication(username, source(request));
                            resolve ({"error": "Authentication failed"})
                        } else {
                            // on success
                            esclient.exists({
                                id: username,                              
                                index: 'customusers',
                            }).then(function(exists) {
                                console.log(exists)

                                if(exists) {
                                    esclient.search({
                                        index: "customusers",
                                        body: {
                                            "query": {
                                                "match_all": {}
                                            }
                                        }
                                    }).then(function(allDocs){
                                        console.log('allDocs', allDocs)
                                        
                                    })
                                    resolve ({"error": "Your request is in process"})     
                                } else {
                                     
                                    esclient.create({
                                        id: username,
                                        index: "customusers",
                                        body: {
                                            user: username
                                        }
                                    }).then(function(userCreated){
                                        console.log('userCreated', userCreated)
                                        resolve ({"error": "Your request is submitted"})      
                                    })
                                    
                                }


                                //TODO move the index creation part to plugin load code
                                
                            })
                            
                            // Request.get(url('/testindex'))
                            //     .on('response', (response) => {
                            //         console.log("yesh", response.body);
                            //         resolve ({"error": "Authentication success"})        
                            //     })
                            // })
                            
                            
                        }
                    });
                });

                  


                return {"message": "ok"}

                // return {"message": "ok"}


                    // .post({
                    //     uri: url('/api/saved_objects/config/requestedUsersList'),
                    //     headers: {
                    //         "Content-Type": "application/json"
                    //     },
                    //     data : {"saved": "this"}
                    // }).on('response', (response) => {
                    //     // Assert.equal(response.statusCode, 200);
                    //     console.log(response.statusCode);
                        
                    // });
            }
        })


        server.route({
            method: 'POST',
            path: '/customlogin',
            config: { auth: false },
            handler(request, h) {
                const username = request.payload.username;
                const password = request.payload.password;
                const nonce = request.payload.nonce;

                return new Promise((resolve, reject) => {
                    Authentication.authenticate(username, password, (err, user, isAdmin) => {
                        Logger.customLog('RESP... *****');
                        Logger.customLog(err);
                        Logger.customLog(user);
                        Logger.customLog(isAdmin);
                        if (err || !user) {
                            Logger.failedAuthentication(username, source(request));
                            resolve(h.response().code(401));
                        } else {
                            // only log succeeded authentication if its not a 2FA attempt.
                            if (!TwoFactor.enabled() || nonce === '') {
                                Logger.succeededAuthentication(user.uid, source(request));
                            }

                            TwoFactor.verify(user.uid, nonce, (success, secret) => {
                                if (success) {
                                    if (TwoFactor.enabled()) {
                                        Logger.succeeded2FA(user.uid, source(request));
                                    }

                                    h.state(cookieName(), Authentication.signToken(user.uid, user.groups), cookie());
                                    h.state('kbn-customlogin',`user=${isAdmin}`, cookie());
                                    resolve(h.response().code(200));
                                } else {
                                    if (nonce != '') {
                                        // if nonce is unset then it wasn't a 2FA verification request.
                                        Logger.failed2FA(user.uid, source(request));
                                    }

                                    if (secret.verified === true) {
                                        // secret already verified return an error.
                                        resolve(h.response({ "error": (nonce) }).code(406));
                                    } else {
                                        // secret is not verified - return a new qr/code.
                                        resolve(h.response(TwoFactor.create(user.uid)).code(406));
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });

        server.route({
            method: 'PUT',
            path: '/updateGroup/{level}',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                var params = request.params || {};
                Logger.customLog( data);
                Logger.customLog(params.level)
                
                return new Promise((resolve, reject) => {
                    esclient.get({
                        index:"customgroups",
                        id : params.level
                    }).then(function(data){
                        data._source.levels.splice(data['remove'],1);
                        esclient.update({
                            index:"customgroups",
                            id : params.level,
                            body:{
                                "doc" : {
                                    "levels" : data._source.levels,

                                }
                            } 
                        }).then(function(data){
                            resolve({'status':true});
                        })
                    })
                    
                })
            }
        });

        server.route({
            method: 'POST',
            path: '/getUserGroup/{type}',
            config: { auth: false },
            handler(request, h) {
                const data = request.payload;
                var params = request.params || {};
                Logger.customLog( data );
                Logger.customLog(params.type);
                var type = params.type;
                if( type === undefined)
                {
                    type = 'visualization';
                }
                
                return new Promise((resolve, reject) => {
                    esclient.search({
                        index: "customusers",
                        body: {
                            "query": {
                                "match": { user: data.username }
                            }
                        }
                    }).then(function(data){
                        Logger.customLog( data)
                        if (data.hits.hits.length > 0)
                        {
                            var group = data.hits.hits[0]._source.group;
                            Logger.customLog(data.hits.hits[0]._source.group)
                            esclient.search({
                                index:"customgroups",
                                body:{
                                    "query":{
                                        "match":{"_id" : group}
                                    }
                                }
                            }).then(function(_data)
                            {
                                var levels =[];
                                var dashboard =  [];
                                 _data.hits.hits.forEach(function(ele) {
                                     Logger.customLog(ele._source.levels);
                                     ele._source.levels.forEach(function(_ele){
                                         _ele.dashboard.forEach(d => {
                                            if(d.dashboard){
                                                Logger.customLog(d.dashboard);
                                                dashboard.push({"id": d.dashboard});
                                            }
                                            if(d.visualization){
                                                d.visualization.forEach(function(___id){
                                                   levels.push({"id": ___id});
                                                });
                                            }
                                         });
                                         
                                         
                                     })

                                });
                                Logger.customLog(type);
                                Logger.customLog(levels);
                                if(type === 'visualization'){
                                _data.hits.hits = levels;
                                } else if (type === 'dashboard') {
                                    _data.hits.hits = dashboard;
                                } else{
                                    _data.hits.hits = [];
                                }
                                resolve({data: _data});
                            })
                        } else
                        {
                        data.hits.hits = [];
                        resolve({ data: data });
                        }
                    });            
                })
            }
        });
        // server.ext('onPreHandler', (request, reply) => {
        //     console.log('onPreHandler', request.path)
        //     if(false && request.path.startsWith("/api/"))
        //     {
        //         is_authorized = auth(request.raw.req.headers['Authorization']);
        //         if(!is_authorized)
        //         {
        //             reply(response.generate_json(null, 'no autorizado', 'UNAUTHORIZED')).code(401);
        //         }
        //         else
        //         {
        //           return reply.continue();
        //         }
        //     }
        //     else
        //     {
        //         return reply.continue();
        //     }
        // });
            

        // Login based scheme as a wrapper for JWT scheme.
        server.auth.scheme("customlogin", (server, options) => {
            return {
                authenticate: async (request, h) => {
                    // console.log("YESHrequesth", h)
                    // console.log("YESHrequest", request)
                    //return h.redirect(`${basePath}/customlogin`).takeover();
                    // Logger.unauthorized(request.url.path, source(request));
                    try {
                        let credentials = await server.auth.test("jwt", request);
                        return h.authenticated({ credentials: credentials });
                    } catch (e) {
                        Logger.unauthorized(request.url.path, source(request));
                        return h.redirect(`${basePath}/customlogin`).takeover();
                    }
                }
            }
        });

        // JWT is used to provide authorization through JWT-cookies.
        try {
            await server.register(require('hapi-auth-jwt2'));

            // needs to be registered so we can reference it from our custom strategy.
            server.auth.strategy('jwt', 'jwt', {
                key: Authentication.secret(),
                validate: validate,
                verifyOptions: { algorithms: ['HS256'] },
                cookieKey: cookieName()
            });

            server.auth.strategy("customlogin", "customlogin", {});

            // hack to override the default strategy that is already set by x-pack.
            server.auth.settings.default = null;

            server.auth.default("customlogin");
        } catch (err) {
            throw err;
        }

    }
};


/**
 * Verifies that the token carried by the request grants access to
 * the requested page or API/Index resource.
 *
 * @param token JWT token carried in a cookie.
 * @param request To be validated.
 * @param callback {error, success}
 */
function validate(token, h) {
    let valid = new Date().getTime() < token.expiry;
    return { isValid: valid };
}


/**
 * Return the cookie configuration from config.json.
 */
function cookie() {
    return Config.load('authentication').cookie;
}

/**
 * @returns the name of the cookie to be used.
 */
function cookieName() {
    return Config.load('authentication').cookieName || "customlogin";
}

/**
 * Grabs the remote IP of the client, supports extracting the
 * X-Forwarded-For header but always includes both the header value
 * and the proxy's IP address (to prevent spoofing the logs).
 */
function source(request) {
    return {
        ip: request.info.remoteAddress,
        forwarded: request.headers['x-forwarded-for']
    };
}