const products = document.querySelectorAll('.shop__list-item')
const basket = document.querySelector('.shop__basket')
const button = document.querySelector('.shop__btn')
let initialLeft = 7
let offsetX, offsetY
let isDragging = false
const remInPixels = parseFloat(getComputedStyle(basket).fontSize)
const widthInPixels = basket.offsetWidth
const widthInRem = widthInPixels / remInPixels
const roundedWidthInRem = Math.round(widthInRem) - 10

products.forEach(product => {
	product.addEventListener('dragstart', e => {
		e.dataTransfer.setData('text/plain', e.currentTarget.id)
		product.classList.add('shop__list-item--active')
	})

	product.addEventListener('dragend', () => {
		product.classList.remove('shop__list-item--active')
	})

	product.addEventListener('touchstart', e => {
		e.preventDefault()

		const touch = e.touches[0]
		offsetX = touch.clientX - product.offsetLeft
		offsetY = touch.clientY - product.offsetTop
		isDragging = true

		product.classList.add('shop__list-item--active')
	})

	product.addEventListener('touchmove', e => {
		if (!isDragging) return

		const touch = e.touches[0]
		const x = touch.clientX - offsetX
		const y = touch.clientY - offsetY

		product.style.left = `${x}px`
		product.style.top = `${y}px`
		product.style.zIndex = `${1}`

		basket.classList.add('shop__basket--active')
	})

	product.addEventListener('touchend', () => {
		isDragging = false
		// Проверяем, находится ли элемент в зоне dropzone
		const draggableRect = product.getBoundingClientRect()
		const dropzoneRect = basket.getBoundingClientRect()
		if (
			draggableRect.left >= dropzoneRect.left &&
			draggableRect.right <= dropzoneRect.right &&
			draggableRect.top >= dropzoneRect.top &&
			draggableRect.bottom <= dropzoneRect.bottom
		) {
			basket.appendChild(product)

			product.style.left = `${initialLeft}rem`
			product.style.bottom = `${15}rem`
			product.style.top = `revert`

			if (initialLeft < roundedWidthInRem) {
				initialLeft += 4
			} else {
				initialLeft = 7
			}

			let limits = basket.querySelectorAll('.shop__list-item')

			if (limits.length > 2) {
				button.classList.add('shop__btn--active')
			}

			basket.classList.remove('shop__basket--active')
			product.style.zIndex = `${0}`
		}
	})
})

basket.addEventListener('dragover', e => {
	e.preventDefault()

	basket.classList.add('shop__basket--active')
})

basket.addEventListener('drop', e => {
	e.preventDefault()
	const data = e.dataTransfer.getData('text/plain')

	const draggedElement = document.getElementById(data)
	basket.appendChild(draggedElement)

	draggedElement.style.left = `${initialLeft}rem`
	draggedElement.style.bottom = `${15}rem`
	draggedElement.style.top = `revert`

	if (initialLeft < roundedWidthInRem) {
		initialLeft += 4
	} else {
		initialLeft = 7
	}

	let limits = basket.querySelectorAll('.shop__list-item')

	if (limits.length > 2) {
		button.classList.add('shop__btn--active')
	}

	basket.classList.remove('shop__basket--active')
})
