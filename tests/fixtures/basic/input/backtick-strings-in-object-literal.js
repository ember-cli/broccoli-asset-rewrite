var a = {
  b: {
    backticksOnly: `/images/sample.png`,
    interpolationWithProperty: `${this.config.baseUrl}/images/sample.png`,
    interpolationWithMethodCall: `${this.getBaseUrl()}/images/sample.png`,
    interpolationWithMethodCallSingleQuotes: `${this.get('baseUrl')}/images/sample.png`,
    interpolationWithMethodCallDoubleQuotes: `${this.get("baseUrl")}/images/sample.png`
  }
};
