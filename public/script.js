const btnContainer = document.querySelector('.btn-container');
const formRegister = document.getElementById('formRegister')
const formLogin = document.getElementById('formLogin')

$(document).ready(async function() {
  if (btnContainer) {
    btnContainer.addEventListener('click', async (event) => {
      const target = event.target;
  
      if (target.matches('.btn')) {
        if (target.classList.contains('js-btn-unavailable') || target.classList.contains('js-btn-done')) {
          const btnCurrentValue = target.getAttribute('data-current-value');
          const btnNextValue = target.getAttribute('data-next-value');
          const response = await fetch('/finishCurrentQueue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              queueID: btnCurrentValue,
              nextQueueID: btnNextValue
            })
          });
  
          const data = await response.json();
          if (data.success) {
            location.reload();
          }
        }
      }
    });
  }
  if(formRegister) {
    $(formRegister).on('submit', async function(e) {
        e.preventDefault()
        
        const fd = new FormData()
        const thisFormData = $(this).serializeArray()

        thisFormData.forEach(async ({name, value}) => {
          fd.append(name, value)
        })

        try {

          const response = await fetch('/registerAccount', {
            method: 'POST',
            body: fd
          })

          const data = await response.json()
          if(data.success) {
            window.location.href = "/"
          }

        } catch(err) {
          console.error(err)
        }
    }) 
  }
  if(formLogin) {
    $(formLogin).on('submit', async function(e){
        e.preventDefault()

        const fd = new FormData()
        const thisLoginForm = $(this).serializeArray()

        thisLoginForm.forEach(({name, value}) => {
          fd.append(name, value)
        })

        try {

          const response = await fetch('/loginAccount', {
            method: 'POST',
            body: fd
          })

          const data = await response.json()
          if(data.success) {
            window.location.href="/home"
          }
        } catch(err) {
          console.error(err)
        }

      })
  }
})
