var a = {
  b: {
    backticksOnly: `/images/fingerprinted-sample.png`,
    interpolationWithProperty: `${this.config.baseUrl}/images/fingerprinted-sample.png`,
    interpolationWithMethodCall: `${this.getBaseUrl()}/images/fingerprinted-sample.png`,
    interpolationWithMethodCallSingleQuotes: `${this.get('baseUrl')}/images/fingerprinted-sample.png`,
    interpolationWithMethodCallDoubleQuotes: `${this.get("baseUrl")}/images/fingerprinted-sample.png`
  }
};
