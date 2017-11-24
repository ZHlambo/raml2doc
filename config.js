var path = require("path");
var base_paths = path.join("")

var config = {
    server_host: getIPAdress(),
    server_port: 8081,
    env: process.env.NODE_ENV || 'development',
    utils_paths: (() => {
        const resolve = path.resolve
        const base = (...args) =>
            resolve.apply(resolve, [path.resolve(__dirname), ...args])
        return {
            base: base,
            src: base.bind(null, "src"),
            dist: base.bind(null, "dists")
        }
    })(),
}
var argv = process.argv.splice(2) //可在命令后面拼接port参数  默认为3333
config.server_port = argv.length > 0 ? Number(argv[0]) : config.server_port
if (config.env == "development") { //根据环境，配置获取文件的指向路径
    config.compiler_public_path = `http://${config.server_host}:${config.server_port}/`
    config.dev = true
    config.pro = false
    config.devtool = 'source-map'
} else {
    config.compiler_public_path = "/"
    config.dev = false
    config.pro = true
    config.devtool = undefined
}
config.globals = {
    'process.env': {
        'NODE_ENV': JSON.stringify(config.env === 'development' ? 'development' : "production") //production外使用webpack压缩会提示warning
    },
    'NODE_ENV': config.env,
    '__DEV__': config.dev,
    '__PROD__': config.pro,
    '__ROUTER__': config.pro ? "'/manage/'" : "'/'",
}

function getIPAdress() { //o获取本机ip
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}


module.exports = config
