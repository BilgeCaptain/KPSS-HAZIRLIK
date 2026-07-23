/* =========================================================
   KPSS AKADEMİ — JAVASCRIPT DOSYASI
   Bölümler:
   1) Mobil menü aç/kapat
   2) Sınav sayacı (countdown)
   3) Program Oluşturucu algoritması
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     1) MOBİL MENÜ AÇ/KAPAT
     ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const acikMi = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', acikMi ? 'true' : 'false');
  });

  // Bir linke tıklanınca mobil menüyü otomatik kapat
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Footer'daki yıl bilgisini otomatik güncelle
  document.getElementById('yil').textContent = new Date().getFullYear();


  /* =========================================================
     2) SINAV SAYACI (COUNTDOWN)
     ---------------------------------------------------------
     ÖSYM'nin açıkladığı 2026-KPSS Lisans Genel Yetenek-Genel
     Kültür oturumu 6 Eylül 2026, saat 10:15'te yapılacaktır.
     Farklı bir sınav dönemi için bu tarihi güncellemeniz yeterli.
     ========================================================= */
  const SINAV_TARIHI = new Date('2026-09-06T10:15:00');

  const elGun = document.getElementById('cd-gun');
  const elSaat = document.getElementById('cd-saat');
  const elDakika = document.getElementById('cd-dakika');
  const elSaniye = document.getElementById('cd-saniye');
  const elNot = document.getElementById('countdownNote');

  // İki haneli gösterim için yardımcı fonksiyon (örn: 5 -> "05")
  function ikiHaneli(sayi) {
    return String(sayi).padStart(2, '0');
  }

  function sayaciGuncelle() {
    const simdi = new Date();
    const kalanMs = SINAV_TARIHI - simdi;

    // Sınav tarihi geçtiyse sayacı sıfırla ve bilgi mesajı göster
    if (kalanMs <= 0) {
      elGun.textContent = '00';
      elSaat.textContent = '00';
      elDakika.textContent = '00';
      elSaniye.textContent = '00';
      elNot.textContent = 'Sınav tarihi geride kaldı. Bir sonraki dönem için SINAV_TARIHI değişkenini güncelleyebilirsiniz.';
      return;
    }

    const gun = Math.floor(kalanMs / (1000 * 60 * 60 * 24));
    const saat = Math.floor((kalanMs / (1000 * 60 * 60)) % 24);
    const dakika = Math.floor((kalanMs / (1000 * 60)) % 60);
    const saniye = Math.floor((kalanMs / 1000) % 60);

    elGun.textContent = ikiHaneli(gun);
    elSaat.textContent = ikiHaneli(saat);
    elDakika.textContent = ikiHaneli(dakika);
    elSaniye.textContent = ikiHaneli(saniye);
    elNot.textContent = 'KPSS Lisans (Genel Yetenek-Genel Kültür) — 6 Eylül 2026';
  }

  sayaciGuncelle();
  setInterval(sayaciGuncelle, 1000); // Her saniye günceller


  /* =========================================================
     3) PROGRAM OLUŞTURUCU ALGORİTMASI
     ---------------------------------------------------------
     Mantık özeti:
     - Kullanıcı günlük çalışma saatini bir slider ile seçer.
     - Kullanıcı checkbox'lardan istediği dersleri seçer.
     - Seçilmeyen (tiki kaldırılan) dersler HİÇBİR ŞEKİLDE
       tabloya yazılmaz.
     - Toplam çalışma saati, sadece seçilen derslere eşit
       ağırlıkla (round-robin / sırayla) dağıtılır. Böylece
       seçilmeyen bir dersin süresi otomatik olarak diğer
       seçili derslere aktarılmış olur.
     - Yeni bir ders eklemek isterseniz: sadece HTML'deki
       ders-grid içine yeni bir <label class="ders-chip"> satırı
       eklemeniz yeterli — bu JS kodu otomatik olarak onu da
       algoritmaya dahil eder, ekstra kod yazmanıza gerek yok.
     ========================================================= */

  const form = document.getElementById('programForm');
  const saatInput = document.getElementById('calismaSaati');
  const saatDegerEtiketi = document.getElementById('saatDeger');
  const resultWrap = document.getElementById('resultWrap');
  const resultSaat = document.getElementById('resultSaat');
  const planTableHead = document.getElementById('planTableHead');
  const planTableBody = document.getElementById('planTableBody');
  const planNote = document.getElementById('planNote');

  const HAFTA_GUNLERI = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  // Slider hareket ettikçe üstteki "X saat" etiketini canlı güncelle
  saatInput.addEventListener('input', function () {
    saatDegerEtiketi.textContent = saatInput.value + ' saat';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Sayfanın yenilenmesini engelle

    const gunlukSaat = parseInt(saatInput.value, 10);

    // Formdaki TÜM ders checkbox'larını tara
    const tumDersCheckboxlari = Array.from(form.querySelectorAll('input[name="ders"]'));

    // Sadece TİKLİ (seçili) olan dersleri al -> tiki kaldırılanlar bu listeye asla girmez
    const secilenDersler = tumDersCheckboxlari
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });

    // Tiki kaldırılan dersleri de ayrıca tutalım (bilgi notu yazdırmak için)
    const secilmeyenDersler = tumDersCheckboxlari
      .filter(function (cb) { return !cb.checked; })
      .map(function (cb) { return cb.value; });

    // Hiç ders seçilmediyse kullanıcıyı uyar ve işlemi durdur
    if (secilenDersler.length === 0) {
      alert('Lütfen en az bir ders seçin. Hiç ders seçmezsen program oluşturulamaz.');
      return;
    }

    // Programı hesapla ve ekrana bas
    const gunlukProgram = gunlukProgramiHesapla(gunlukSaat, secilenDersler);
    tabloyuCiz(gunlukProgram, gunlukSaat);
    notuYaz(secilenDersler, secilmeyenDersler, gunlukSaat);

    resultWrap.hidden = false;
    resultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /**
   * Günlük çalışma saatini, seçilen derslere sırayla (round-robin) dağıtır.
   * Örn: 4 saat, 3 ders seçiliyse -> Ders1: 2 saat, Ders2: 1 saat, Ders3: 1 saat
   * Bu sayede kalan/artan saatler de kaybolmadan bir derse eklenmiş olur.
   *
   * @param {number} toplamSaat - Kullanıcının seçtiği günlük çalışma saati
   * @param {string[]} dersler - Seçili ders isimleri listesi
   * @returns {Object} { dersAdi: saat } şeklinde bir harita (map)
   */
  function gunlukProgramiHesapla(toplamSaat, dersler) {
    const dagitim = {};
    dersler.forEach(function (ders) { dagitim[ders] = 0; }); // Başlangıçta herkese 0 saat

    // Saatleri teker teker, sırayla derslere dağıtıyoruz (round-robin)
    // Böylece 7 saat / 3 ders gibi tam bölünmeyen durumlarda da
    // fazla saat otomatik olarak ilk derslere ekstra gider.
    for (let i = 0; i < toplamSaat; i++) {
      const siradakiDers = dersler[i % dersler.length];
      dagitim[siradakiDers] += 1;
    }

    return dagitim;
  }

  /**
   * Hesaplanan günlük dağıtımı, 7 günlük bir haftalık tabloya dönüştürüp DOM'a basar.
   * Her gün aynı günlük dağıtım kullanılır (kullanıcı isterse ilerde
   * gün bazlı farklılaştırma eklenebilir — bu kısmı genişletmeye uygun bıraktık).
   */
  function tabloyuCiz(gunlukProgram, gunlukSaat) {
    // --- Tablo başlığı (Gün isimleri) ---
    planTableHead.innerHTML = '<th>Ders / Gün</th>' +
      HAFTA_GUNLERI.map(function (gun) { return '<th>' + gun + '</th>'; }).join('');

    // --- Tablo gövdesi: her ders için bir satır, her günde kaç saat çalışılacağı ---
    const dersAdlari = Object.keys(gunlukProgram);

    let satirlarHtml = '';
    dersAdlari.forEach(function (ders) {
      const saat = gunlukProgram[ders];
      if (saat <= 0) return; // Güvenlik: 0 saat düşen ders varsa satır oluşturma

      satirlarHtml += '<tr><td><strong>' + ders + '</strong></td>';
      // Aynı ders her gün için tekrarlanır (haftalık düzenli tekrar mantığı)
      for (let g = 0; g < 7; g++) {
        satirlarHtml += '<td><span class="subject-chip">' + saat + ' sa</span></td>';
      }
      satirlarHtml += '</tr>';
    });

    planTableBody.innerHTML = satirlarHtml;
    resultSaat.textContent = 'Günde toplam ' + gunlukSaat + ' saat';
  }

  /**
   * Kullanıcıya, seçmediği derslerin süresinin nereye aktarıldığını
   * açıklayan bilgilendirme notunu yazar.
   */
  function notuYaz(secilenDersler, secilmeyenDersler, gunlukSaat) {
    if (secilmeyenDersler.length === 0) {
      planNote.textContent = 'Tüm dersleri seçtin, ' + gunlukSaat + ' saatlik çalışma süren aralarında eşit şekilde paylaştırıldı. İyi çalışmalar!';
      return;
    }

    const secilmeyenListesi = secilmeyenDersler.join(', ');
    const secilenListesi = secilenDersler.join(', ');

    planNote.textContent =
      secilmeyenListesi + ' dersini/derslerini seçmedin, bu derslere ayrılacak süre otomatik olarak ' +
      secilenListesi + ' derslerine eklendi.';
  }

});
