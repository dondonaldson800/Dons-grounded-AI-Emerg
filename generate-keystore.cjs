const forge = require('node-forge');
const fs = require('fs');

// Generate a key pair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 25); // 25 years

const attrs = [{
  name: 'commonName',
  value: 'Don Empire'
}, {
  name: 'countryName',
  value: 'US'
}, {
  shortName: 'ST',
  value: 'CA'
}, {
  name: 'localityName',
  value: 'Los Angeles'
}, {
  name: 'organizationName',
  value: 'Empire'
}, {
  shortName: 'OU',
  value: 'Dev'
}];
cert.setSubject(attrs);
cert.setIssuer(attrs);

// Self-sign the certificate
cert.sign(keys.privateKey, forge.md.sha256.create());

// Create a PKCS#12 container
const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
  keys.privateKey, [cert], 'password',
  {generateLocalKeyId: true, friendlyName: 'empire-key'}
);

// Encode and save
const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
fs.writeFileSync('empire.p12', p12Der, 'binary');
console.log('empire.p12 generated successfully');
