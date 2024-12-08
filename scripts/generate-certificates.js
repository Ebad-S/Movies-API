const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

// Create SSL directory if it doesn't exist
const sslDir = path.join(__dirname, '..', 'ssl');
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir);
}

// Generate a key pair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();

// Set certificate details
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

// Add certificate attributes
const attrs = [{
    name: 'commonName',
    value: 'localhost'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);

// Sign the certificate
cert.sign(keys.privateKey);

// Convert to PEM format
const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
const certificatePem = forge.pki.certificateToPem(cert);

// Save files
fs.writeFileSync(path.join(sslDir, 'key.pem'), privateKeyPem);
fs.writeFileSync(path.join(sslDir, 'cert.pem'), certificatePem);

console.log('SSL certificates generated successfully!'); 