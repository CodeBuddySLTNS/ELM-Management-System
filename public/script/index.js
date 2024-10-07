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

// toggle profile in large screens
document.querySelector('.lgUser').onclick = () => {
  document.querySelector('.lgUserInfo').classList.toggle('toggleUserInfo');
}

// fetch files and data when the page first load
window.addEventListener("load", async () => {
  try {
    const {data} = await axios.get('/user');
    // use the data if there's a data response from a request
    if (data) {
      // distribute the school name, system name and logo to the pages
      document.querySelector('.schoolLogo').src = data.schoolLogo;
      document.querySelector('.schoolLogo').style.display = 'block';
      const smTitle = document.querySelector('.smTitle');
      smTitle && (smTitle.innerHTML = `
        <h2>${data.schoolName.sm}</h2>
        <p>${data.systemName}</p>`);
      const lgTitle = document.querySelector('.lgTitle');
      lgTitle && (lgTitle.innerHTML = `
        <h2>${data.schoolName.lg}</h2>
        <p>${data.systemName}</p>`);
       
       // distribute the user data to all html pages once loggedIn
      if (data.loggedIn) {
        if (data.profileImg) document.querySelectorAll('.userImg').forEach(element => element.style.backgroundImage = `url('${data.profileImg}')`);
        document.querySelectorAll('.userName').forEach(element => element.textContent = data.firstName + ' ' + data.lastName);
        document.querySelectorAll('.studentCourse').forEach(element => element.textContent = data.department ? data.department.split('|')[0] + 'Student' : data.username === 'user' ? 'Test user' : 'Faculty');
        if (data.role == 'Admin') {
          document.querySelector('.links').innerHTML += `
          <a href="/admin">
            <li>
              <i class="fa-solid fa-crown"></i>
              <p>Admin Panel</p>
            </li>
          </a>`;
        }
      } else {
        document.querySelectorAll('.logoutBtn').forEach(btn => {
          btn.style.background = 'var(--c1)';
          btn.innerHTML = 'Login <i class="fa-solid fa-right-to-bracket"></i>';
        })
      }
      
      // fetch config data
      const {data:configs} = await axios.get('/config/general');
      // use the config data in homepage (index)
      const categoryFilter = document.querySelector('.categoryFilter');
      const departmentFilter = document.querySelector('.departmentFilter');
      if (categoryFilter) {
        for (categ of configs.categories) {
          categoryFilter.innerHTML += `
            <label>
              <input class="categ" type="radio" value="${categ}">
              ${categ}
            </label>`;
        }
      }
      const categs = document.querySelectorAll('.categ');
      // handle click events on every categoryFilter
      if (categs.length > 0) {
        for (categ of categs) {
          categ.onclick = async (e) => {
            const categValue = e.target.value;
            for (value of categs) {
              if (value.value === categValue) continue;
              value.checked = false;
            }
            // request files from server based on the filtered category and departments
            document.querySelector('.loader').style.display = 'block';
            document.querySelector('.documents').style.visibility = 'hidden';
            
            await fetchFiles(categValue, departmentFilter.value);
            
            document.querySelector('.loader').style.display = 'none';
            document.querySelector('.documents').style.visibility = 'visible';
          }
        }
        // and call the fetchFiles function
        await fetchFiles();
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('.headName').style.visibility = 'visible';
        document.querySelector('.searchFilter').style.visibility = 'visible';
        document.querySelector('.documents').style.visibility = 'visible';
      }
      
      if (departmentFilter) {
        for (dep of configs.departments) {
          departmentFilter.innerHTML += `
            <option value="${dep}">${dep.split('|')[0].trim()}</option>`;
        }
        // handle change event on departmentFilter
        departmentFilter.onchange = async (e) => {
          // get the filtered category value
          if (categs.length > 0) {
            for (categ of categs) {
              if (categ.checked) {
                // request files from server based on the filtered category and department
                document.querySelector('.loader').style.display = 'block';
                document.querySelector('.documents').style.visibility = 'hidden';
                
                await fetchFiles(categ.value, e.target.value);
                
                document.querySelector('.loader').style.display = 'none';
                document.querySelector('.documents').style.visibility = 'visible';
              }
            }
          }
        }
      }
      
      // use the config data in upload and signup page
      const departmentInput = document.querySelector('.department');
      const categoryInput = document.querySelector('.category');
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

// load all files in homepage (index)
async function fetchFiles(category, department) {
  const response = await axios.get(`/files?category=${category}&department=${department}`);
  const files = response.data;
  document.querySelector('.categName').textContent = 'Category: ' + ((category == 'Recent' ? 'Recently added' : category) || 'Recently added');
  document.querySelector('.docs').innerHTML = `
    <div class="norecords">
      <p>No file found.</p>
    </div>`;
  if (files.length > 0) {
    for (file of files) {
      document.querySelector('.docs').innerHTML += `
        <a href="/files/file?id=${file._id}">
          <div class="resPaper">
            <div class="resImage" style="background-image: url('${file.thumbnail}')">
              ${file.thumbnail ? '' : '<span>PDF</span>'}
            </div>
            <div class="resImage"></div>
            <p class="resTitle">${file.name}</p>
          </div>
        </a>`;
    }
  } else {
    document.querySelector('.norecords').style.display = 'block';
  }
}
