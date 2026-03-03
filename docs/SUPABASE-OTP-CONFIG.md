# Konfigurasi Supabase untuk Email OTP

## ⚠️ Penting: Supabase OTP adalah 8 Digit

Supabase secara default mengirim OTP dengan **8 digit**, bukan 6 digit. Aplikasi sudah dikonfigurasi untuk menerima 6-8 digit.

## Langkah 1: Aktifkan Email OTP di Supabase

1. **Login ke Supabase Dashboard**
   - Buka https://supabase.com/dashboard
   - Pilih project Anda

2. **Buka Authentication Settings**
   - Klik "Authentication" di sidebar
   - Klik "Providers" tab
   - Klik "Email"

3. **Konfigurasi Email Provider**
   - ✅ Centang "Enable Email provider"
   - ✅ Centang "Confirm email" 
   - Save changes

## Langkah 2: Customize Email Template

1. **Buka Email Templates**
   - Klik "Authentication" di sidebar
   - Klik "Email Templates" tab
   - Pilih "Confirm signup"

2. **Edit Template untuk OTP**

Ganti template dengan ini:

### Subject:
```
Kode OTP Anda - E-Health Education
```

### Body (HTML):
```html
<h2>Kode OTP Anda</h2>
<p>Halo,</p>
<p>Gunakan kode OTP berikut untuk login ke E-Health Education Pneumonia Balita:</p>

<div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
  <h1 style="font-size: 36px; letter-spacing: 8px; margin: 0; color: #2563EB; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p style="color: #6b7280;">Kode ini berlaku selama <strong>60 menit</strong>.</p>
<p style="color: #6b7280; font-size: 14px;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="color: #9ca3af; font-size: 12px;">
  Email ini dikirim oleh E-Health Education Pneumonia Balita<br>
  Powered by Supabase
</p>
```

**Catatan:** `{{ .Token }}` akan menampilkan kode OTP 8 digit dari Supabase.

3. **Save Template**

## Langkah 3: Test Email Template

Di bagian bawah template editor, ada section "Preview":
- Klik "Send test email"
- Masukkan email Anda
- Cek inbox untuk melihat tampilan email OTP

## Template Variables yang Tersedia

Supabase menyediakan variables ini untuk email template:

- `{{ .Token }}` - Kode OTP 6 digit
- `{{ .TokenHash }}` - Hash dari token
- `{{ .ConfirmationURL }}` - URL konfirmasi (tidak dipakai untuk OTP)
- `{{ .SiteURL }}` - URL aplikasi Anda
- `{{ .Email }}` - Email user
- `{{ .Data }}` - Custom data (jika ada)
- `{{ .RedirectTo }}` - Redirect URL (jika ada)

## Template Alternatif (Lebih Simple)

Jika ingin lebih sederhana:

### Subject:
```
Kode OTP: {{ .Token }}
```

### Body:
```html
<h2>Login ke E-Health Education</h2>
<p>Kode OTP Anda adalah:</p>
<h1 style="font-size: 48px; color: #2563EB; letter-spacing: 10px;">{{ .Token }}</h1>
<p>Berlaku selama 60 menit.</p>
```

## Template dengan Styling Lengkap

Untuk tampilan profesional:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #2563EB;">
    <h1 style="color: #2563EB; margin: 0;">E-Health Education</h1>
    <p style="color: #6b7280; margin: 5px 0;">Pneumonia Balita</p>
  </div>

  <!-- Content -->
  <div style="padding: 30px 0;">
    <h2 style="color: #1f2937;">Kode OTP Anda</h2>
    <p style="color: #4b5563;">Halo,</p>
    <p style="color: #4b5563;">Gunakan kode berikut untuk login ke aplikasi E-Health Education:</p>
    
    <!-- OTP Box -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Kode OTP</p>
      <h1 style="color: #ffffff; font-size: 48px; letter-spacing: 12px; margin: 0; font-weight: bold;">
        {{ .Token }}
      </h1>
    </div>

    <!-- Info -->
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; color: #92400e;">
        ⏱️ <strong>Penting:</strong> Kode ini berlaku selama <strong>60 menit</strong>
      </p>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      Jika Anda tidak meminta kode ini, abaikan email ini. Akun Anda tetap aman.
    </p>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
      © 2024 E-Health Education Pneumonia Balita
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
      Email ini dikirim secara otomatis, mohon tidak membalas.
    </p>
  </div>

</body>
</html>
```

## Setelah Konfigurasi

Setelah template disimpan, sistem OTP Supabase akan:
1. ✅ Generate kode OTP 6 digit
2. ✅ Kirim email dengan template yang sudah dikustomisasi
3. ✅ Kode berlaku 60 menit
4. ✅ User masukkan kode di aplikasi
5. ✅ Verifikasi dan login

## Testing

Setelah setup:

1. Buka aplikasi: http://localhost:3000
2. Klik "Masuk"
3. Masukkan email
4. Klik "Kirim Kode OTP"
5. **Cek email** - akan menerima email dengan kode OTP
6. Masukkan kode OTP
7. Klik "Verifikasi"
8. ✅ Berhasil login!

## Troubleshooting

### Email tidak terkirim
- Cek Supabase Dashboard > Authentication > Logs
- Pastikan "Confirm email" dicentang
- Cek spam folder

### Template tidak berubah
- Clear cache browser
- Tunggu beberapa menit
- Test dengan email baru

### Kode OTP tidak muncul di email
- Pastikan menggunakan `{{ .Token }}` bukan `{{ .ConfirmationURL }}`
- Save template dan test lagi

## Tips

1. **Test template** sebelum production
2. **Customize branding** sesuai kebutuhan
3. **Tambahkan logo** jika ada
4. **Gunakan inline CSS** untuk kompatibilitas email client
5. **Test di berbagai email client** (Gmail, Outlook, Yahoo)

## Next Steps

Setelah template dikonfigurasi:
1. ✅ Test OTP flow lengkap
2. ✅ Verify email terkirim dengan benar
3. ✅ Test di berbagai email provider
4. ✅ Lanjut ke checkpoint testing
