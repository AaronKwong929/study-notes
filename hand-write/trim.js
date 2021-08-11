String.prototype.trim = function () {
  return this.replace(/^\s\s*/, ``).replace(/\s\s*$/, ``);
};

console.log(`  abc    `.trim());