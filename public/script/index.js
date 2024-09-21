//  toggle menu
const menuBtn = document.querySelector('.menuBtn');
const navigation = document.querySelector(".navigation");

menuBtn.onclick = () => {
  navigation.classList.add('toggleMenu');
}
document.querySelector('.closeMenu').onclick = () => {
  navigation.classList.remove('toggleMenu');
}

// add event listener to logoutBtn
document.querySelectorAll('.logoutBtn').forEach(btn => {
    btn.addEventListener("click", async (e) => {
    try{
      const {data} = await axios.get('/auth/logout');
      if (data.loggedOut) window.location.href = '/auth/login';
    } catch (e) {
      alert('Error logging out.')
      console.log(e)
    }
  })
})

document.querySelector('.lgUser').onclick = () => {
  document.querySelector('.lgUserInfo').classList.toggle('toggleUserInfo');
}

window.addEventListener("load", async () => {
  try {
    const {data} = await axios.get('/user');
    if (data) {
      if (data.profileImg) document.querySelectorAll('.userImg').forEach(element => element.style.backgroundImage = `url('${data.profileImg}')`);
      document.querySelectorAll('.userName').forEach(element => element.textContent = data.firstName + ' ' + data.lastName);
      document.querySelectorAll('.studentCourse').forEach(element => element.textContent = data.department.split('|')[0] + 'Student');
      
      const departmentInput = document.querySelector('.department');
      const categoryInput = document.querySelector('.category');
      const {data:configs} = await axios.get('/config/general');
      if (configs) {
        if (categoryInput) {
          for (categ of configs.categories) {
            categoryInput.innerHTML += `<option value="${categ}">${categ}</option>`
          }
        }
        if (departmentInput) {
          for (dep of configs.departments) {
            departmentInput.innerHTML += `<option value="${dep}">${dep.split('|')[1].trim()}</option>`
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
})