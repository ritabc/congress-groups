const crypto = require("crypto");

/**
 * The MD4 algorithm is not available anymore in Node.js 17+ (because of library SSL 3).
 * In that case, silently replace MD4 by the MD5 algorithm.
 *
 * https://stackoverflow.com/a/72219174
 */

try {
  crypto.createHash("md4");
} catch (e) {
  console.warn('Crypto "MD$" is not supported by this Node.js version');
  const origCreateHash = crypto.createHash;
  crypto.createHash = (algo, opts) => {
    return origCreateHash(algo == "md4" ? "md5" : algo, opts);
  };
}
