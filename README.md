# OpenSSL

- [HTTPS Authorized Certs with Node.js](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2)
- [Generate certificates with Online tool](https://certificatetools.com/newui/)

## Certification authority (CA)
```
openssl req -new -x509 -config ca.cnf -keyout ca_key.pem -out ca_cert.pem
```

## Server

### Generate server key
```
openssl genrsa -out server_key.pem 4096
```

### Generate server Certificate Signing Request (CSR)
```
openssl req -new -config server.cnf -key server_key.pem -out server_csr.pem
```

### Sign server CSR
```
openssl x509 -req -extfile server.cnf -extensions req_ext -passin "pass:password" -in server_csr.pem -CA ca_cert.pem -CAkey ca_key.pem -CAcreateserial -out server_cert.pem
```

## Client

### Generate client key
```
openssl genrsa -out client_key.pem 4096
```

### Generate client Certificate Signing Request (CSR)
```
openssl req -new -config client.cnf -key client_key.pem -out client_csr.pem
```

### Sign client CSR
```
openssl x509 -req -extfile client.cnf -passin "pass:password" -in client_csr.pem -CA ca_cert.pem -CAkey ca_key.pem -CAcreateserial -out client_cert.pem
```

## Verify server/client certificates
```
openssl verify -CAfile ca_cert.pem server_cert.pem
openssl verify -CAfile ca_cert.pem client_cert.pem
```

## Show server/client certificates
```
openssl x509 -text -noout -in server_cert.pem
openssl x509 -text -noout -in client_cert.pem
```

Command to copy SSH key
```
ssh-copy-id -i ~/.ssh/linode_proxy proxyuser@172.104.247.163 -o PubkeyAuthentication=no
```

Command to sync folders
```
rsync -e ssh -vizaP /home/lex/WebstormProjects/node-proxy/ proxyuser@172.104.247.163:/home/proxyuser/node-proxy/ --exclude=node_modules --exclude=.idea --exclude=.git
```