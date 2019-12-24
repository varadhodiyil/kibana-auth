export default function (a, b, c) {
    const d = c.clientAction.factory;
    a.prototype.readonlyrest = c.clientAction.namespaceFactory(), a.prototype.readonlyrest.prototype.currentuser = d({
        url: {
            fmt: '/_readonlyrest/metadata/current_user'
        }
    }), a.prototype.readonlyrest.prototype.saveConfig = d({
        method: 'POST',
        needBody: !0,
        url: {
            fmt: '/_readonlyrest/admin/config'
        }
    }), a.prototype.readonlyrest.prototype.getConfig = d({
        url: {
            fmt: '/_readonlyrest/admin/config'
        }
    }), a.prototype.readonlyrest.prototype.getConfigFile = d({
        url: {
            fmt: '/_readonlyrest/admin/config/file'
        }
    })
}