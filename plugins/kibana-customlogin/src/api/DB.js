
var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

module.exports = {

    //TODO move all the hardcoded inideces names to config file 
    /**
     * create customusers groups
     */
    init: function () {
        esclient.indices.exists({                    
            index: 'customusers',
        }).then(function(exists) {   
            console.log(exists)
            if(!exists){                
                esclient.indices.create({
                    index: 'customusers',
                    body: {
                        settings : {
                            "number_of_shards" : 1
                        },
                        mappings : {
                            "properties" : {
                                "username" : { "type" : "text" },
                                "isLinked" : { "type" : "boolean" },
                                "group" : { "type" : "text" },
                                "level" : { "type" : "text" }
                            }
                        }
                    } 
                }).then(function(result){
                    console.log("ceated", result)
                })
            }
        })

        esclient.indices.exists({                    
            index: 'customgroups',
        }).then(function(exists) {
            console.log("customgroups exists", exists)
            if(!exists){                
                esclient.indices.create({
                    index: 'customgroups',
                    body: {
                        settings : {
                            "number_of_shards" : 1
                        },
                        mappings : {
                            "properties" : {
                                "name" : { "type" : "text" },
                                "levels" : { "type" : "object" }
                            }
                        }
                    } 
                }).then(function(result){
                    console.log("ceated", result)
                    
                })
            }
        })
    }

}