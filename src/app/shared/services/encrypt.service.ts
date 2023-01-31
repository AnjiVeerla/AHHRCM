import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  encryptSecretKey = "mySecretKeyHere"; //adding secret key
  constructor() { }

  //Data Encryption Function
encryptData(msg:any) {
  var keySize = 256;
  var salt = CryptoJS.lib.WordArray.random(16);
  var key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
  });
  
  var iv = CryptoJS.lib.WordArray.random(128 / 8);
  
  var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
  });
  
  var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
  
  return result;
}
encrypt(data:any){
  var keySize = 256;
  var salt = CryptoJS.lib.WordArray.random(16);
  var key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
    keySize: keySize / 32,
    iterations: 100
});
  return CryptoJS.AES.encrypt(data.trim(), key)
}

decryptData(ciphertextB64:any) {  
                           
  var key = CryptoJS.enc.Utf8.parse("mysmallkey123456");                             
  var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);  

  var decrypted = CryptoJS.AES.decrypt(ciphertextB64, key, {iv: iv}); 
return decrypted.toString(CryptoJS.enc.Utf8);                       
}
}
