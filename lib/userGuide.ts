import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export function startUserGuide() {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: 'Lanjut',
    prevBtnText: 'Kembali',
    doneBtnText: 'Selesai',
    progressText: '{{current}} dari {{total}}',
    steps: [
      {
        element: '#greeting-card',
        popover: {
          title: '👋 Selamat Datang',
          description: 'Selamat datang di Program Edukasi Pneumonia Balita. Program ini akan membantu Anda memahami cara mengenali, mencegah, dan menangani pneumonia pada balita. Mari kita mulai perjalanan belajar Anda.',
          side: "bottom",
          align: 'start'
        }
      },
      {
        element: '#overview-cards',
        popover: {
          title: '📊 Progress Program',
          description: 'Di bagian ini Anda dapat melihat progress pembelajaran Anda. Progress akan meningkat setiap kali Anda menyelesaikan sesi belajar dan test.',
          side: "bottom",
          align: 'start'
        }
      },
      {
        element: '#progress-card',
        popover: {
          title: '🎯 Alur Pembelajaran',
          description: 'Ini adalah alur pembelajaran Anda. Anda akan melalui Pre-Test, 5 sesi pembelajaran, dan Post-Test. Setiap tahap akan terbuka secara bertahap.',
          side: "bottom",
          align: 'start'
        }
      },
      {
        element: '#pretest-button',
        popover: {
          title: '📝 Mulai Pre-Test',
          description: 'Langkah pertama adalah mengerjakan Pre-Test. Pre-Test bertujuan untuk mengetahui seberapa jauh pengetahuan awal Anda tentang pneumonia balita. Anda harus menyelesaikan Pre-Test sebelum membuka sesi belajar.',
          side: "top",
          align: 'start'
        }
      },
      {
        element: '#session-cards',
        popover: {
          title: '📚 Sesi Pembelajaran',
          description: 'Setelah menyelesaikan Pre-Test, Anda dapat memulai sesi pembelajaran. Setiap sesi berisi materi penting tentang pneumonia pada balita yang akan terbuka secara bertahap.',
          side: "left",
          align: 'start'
        }
      },
      {
        element: '#chatbot',
        popover: {
          title: '💬 Chatbot Bantuan',
          description: 'Jika Anda memiliki pertanyaan tentang pneumonia balita, Anda dapat bertanya langsung kepada chatbot di sini. Chatbot siap membantu Anda 24/7.',
          side: "left",
          align: 'start'
        }
      }
    ],
    onDestroyStarted: () => {
      // Simpan bahwa user sudah melihat guide
      localStorage.setItem('guide_seen', 'true')
      driverObj.destroy()
      
      // Setelah guide selesai, ajak user untuk mulai Pre-Test
      setTimeout(() => {
        const pretestButton = document.querySelector('#pretest-button')
        if (pretestButton) {
          pretestButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
          
          // Tambahkan highlight effect
          pretestButton.classList.add('highlight-pulse')
          setTimeout(() => {
            pretestButton.classList.remove('highlight-pulse')
          }, 3000)
        }
      }, 500)
    }
  })

  driverObj.drive()
}

// Check apakah user sudah pernah melihat guide
export function shouldShowGuide(): boolean {
  if (typeof window === 'undefined') return false
  return !localStorage.getItem('guide_seen')
}

// Reset guide (untuk testing atau jika user ingin melihat lagi)
export function resetGuide() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guide_seen')
  }
}
