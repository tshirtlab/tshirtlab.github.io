const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// JSON verisi almak için bodyParser kullanıyoruz
app.use(bodyParser.json());
app.use(express.static('public')); // Public klasörünü erişilebilir yapıyoruz

// Siparişleri kaydedeceğimiz dosya
const siparisDosyasi = 'public/siparisler.json';

// Sipariş alma endpointi
app.post('/siparis-ver', (req, res) => {
  const siparis = req.body;

  // Var olan siparişleri al ve yeni siparişi ekle
  fs.readFile(siparisDosyasi, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Sipariş dosyasına erişilemedi.');
    }

    let siparisler = [];
    if (data) {
      siparisler = JSON.parse(data);
    }

    siparisler.push(siparis);

    // Yeni siparişler listesini dosyaya kaydet
    fs.writeFile(siparisDosyasi, JSON.stringify(siparisler, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Sipariş kaydedilemedi.');
      }
      res.status(200).send('Sipariş başarıyla alındı!');
    });
  });
});

// Siparişlerin görüntüleneceği endpoint
app.get('/siparisler', (req, res) => {
  fs.readFile(siparisDosyasi, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Sipariş dosyasına erişilemedi.');
    }
    res.json(JSON.parse(data));
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
