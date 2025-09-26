self.__us5$config = {
    prefix: '/explore/web/',
    bare:'https://embeddr.rhw.one/embed#https://wisp.mercurywork.shop',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/explore/us5/us5.handler.js',
    bundle: '/explore/us5/us5.bundle.js',
    config: '/explore/us5/us5.config.js',
    sw: '/explore/us5/us5.sw.js',
}
