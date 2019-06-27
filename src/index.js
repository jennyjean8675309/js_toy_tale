const toyURL = 'http://localhost:3000/toys'
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyFormTag = document.querySelector('.add-toy-form')
const toyDiv = document.querySelector('#toy-collection')
let addToy = false

document.addEventListener('DOMContentLoaded', function() {
  fetchToys()

  toyFormTag.addEventListener('submit', addToyToDatabase)
})

function addToyToDatabase(event) {
  event.preventDefault()

  //get toy information from the submitted form
  let name = event.target.children[1].value
  let image = event.target.children[3].value

  //Prep the new info for the fetch call
  let newToy = {
    name: name,
    image: image,
    likes: 0
  }

  //make a POST fetch request to add the new toy
  fetch(toyURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }, 
    body: JSON.stringify(newToy)
  }).then(response => response.json())
  .then(toy => displayToy(toy))

  toyFormTag.reset()
}

function fetchToys() {
  fetch(toyURL)
    .then(resp => resp.json())
    .then(result => result.forEach(toy => {
      displayToy(toy)
    }))
}

function displayToy(toy) {
  let toyCard = document.createElement('div')
  toyCard.id = toy.id
  toyCard.classList.add('card')

  let toyHeader = document.createElement('h2')
  toyHeader.innerText = toy.name

  let toyImage = document.createElement('img')
  toyImage.classList.add('toy-avatar')
  toyImage.src = toy.image

  let toyLikes = document.createElement('p')
  toyLikes.innerText = toy.likes

  let likeButton = document.createElement('button')
  likeButton.classList.add('like-btn')
  likeButton.innerText = 'Like <3'
  likeButton.addEventListener('click', addLikes)

  toyCard.appendChild(toyHeader)
  toyCard.appendChild(toyImage)
  toyCard.appendChild(toyLikes)
  toyCard.appendChild(likeButton)

  toyDiv.appendChild(toyCard)
}

function addLikes(event) {
  console.log('adding likes ...')

  //find the id of the toy that we clicked on
  let toyId = event.target.parentElement.id

  //find that toy's current number of likes
  let currentLikes = parseInt(event.currentTarget.previousElementSibling.innerText)
  currentLikes++

  //make a patch request to update that toy's likes
  fetch(`${toyURL}/${toyId}`, {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }, 
    body: JSON.stringify({likes: currentLikes})
  }).then(response => response.json())
  .then(res => changeLikesInDOM(res, toyId)) 
}

function changeLikesInDOM(res, toyId) {
  let currentToyCard = document.getElementById(`${toyId}`)
  let p = currentToyCard.children[2]
  let likes = parseInt(p.innerText)
  p.innerText = `${likes + 1}`
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


// OR HERE!
