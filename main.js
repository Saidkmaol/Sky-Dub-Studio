document.addEventListener('DOMContentLoaded', function () {
	// Slider logic for .slider (replace content and update indicators)
	const sliderContainer = document.querySelector('.slider .container');
	if (sliderContainer) {
		const nameEl = sliderContainer.querySelector('.Name');
		const dataEl = sliderContainer.querySelector('.data');
		const genreEl = sliderContainer.querySelector('.genre');
		const descEl = sliderContainer.querySelector('.description');
		const indicators = Array.from(sliderContainer.querySelectorAll('.indicator-line'));
		const prevBtn = sliderContainer.querySelector('.slider-controls .prev');
		const nextBtn = sliderContainer.querySelector('.slider-controls .next');
		const slideNumber = sliderContainer.querySelector('.slide-number');

		// Example slides data (you can replace with dynamic content)
		const slides = [
			{
				Name: 'Название слайда 1',
				data: 'Осень | 2025 | 12 эпизодов | 16+',
				genre: 'Жанр: Фантастика'
			},
			{
				Name: 'Название слайда 2',
				data: 'Зима | 2024 | 24 эпизода | 13+',
				genre: 'Жанр: Приключения'
			},
			{
				Name: 'Название слайда 3',
				data: 'Весна | 2023 | Фильм | 18+',
				genre: 'Жанр: Драма'
			},
			{
				Name: 'Название слайда 4',
				data: 'Лето | 2022 | Спецвыпуск | 0+',
				genre: 'Жанр: Комедия'
			}
		];

		let current = 0;

		function render(index, animate = true) {
			if (index < 0) index = slides.length - 1;
			if (index >= slides.length) index = 0;
			const s = slides[index];

			const doUpdate = () => {
				if (nameEl) nameEl.textContent = s.Name;
				if (dataEl) dataEl.textContent = s.data;
				if (genreEl) genreEl.textContent = s.genre;
				// Always use the original (shared) description for each slide
				const ORIGINAL_DESCRIPTION = 'Описание: это высказывание, которое состоит из двух и более предложений. Для того чтобы верно определить, перед нами текст или набор предложений, необходимо помнить про ключевые признаки текста: предложения объединены общей темой. В тексте можно выделить главную мысль, то есть то важное, что хотел сказать автор читателю. Этот второй абзац продолжает описание и даёт дополнительные детали — можно использовать его для сеттинга, заметок о производстве или коротких рецензий. Держите текст кратким, чтобы визуально было легче воспринимать содержимое слайда.';
				if (descEl) descEl.textContent = ORIGINAL_DESCRIPTION;
				// update indicators
				indicators.forEach((el, i) => el.classList.toggle('active', i === index));
				// update slide number
				if (slideNumber) slideNumber.textContent = `${index + 1} / ${slides.length}`;
				current = index;
			};

			if (!animate) {
				doUpdate();
				return;
			}

			// animate: fade out -> update -> fade in
			if (sliderContainer.classList.contains('fade-out')) return; // already animating
			sliderContainer.classList.add('fade-out');
			// wait for the fade-out to finish (match transition duration in CSS ~260ms)
			setTimeout(() => {
				doUpdate();
				sliderContainer.classList.remove('fade-out');
				// ensure visible
				sliderContainer.classList.add('fade-in');
				// remove fade-in after transition completes
				setTimeout(() => sliderContainer.classList.remove('fade-in'), 300);
			}, 280);
		}

		if (prevBtn) prevBtn.addEventListener('click', () => { render(current - 1, true); restartAutoplay(); });
		if (nextBtn) nextBtn.addEventListener('click', () => { render(current + 1, true); restartAutoplay(); });

		indicators.forEach((el, i) => el.addEventListener('click', () => { render(i, true); restartAutoplay(); }));

		// autoplay (advance every 5s). Clicking buttons will not disable autoplay; it restarts the timer.
		let autoplayInterval = null;
		function startAutoplay() {
			stopAutoplay();
			autoplayInterval = setInterval(() => { render(current + 1, true); }, 5000);
		}
		function stopAutoplay() {
			if (autoplayInterval) {
				clearInterval(autoplayInterval);
				autoplayInterval = null;
			}
		}
		function restartAutoplay() {
			startAutoplay();
		}

		// init without animation
		render(0, false);
		startAutoplay();
	}

	// Schedule day filtering
	const scheduleDaysWrapper = document.querySelector('.schedule-days-wrapper');
	const scheduleDays = document.querySelector('.schedule-days');
	const scheduleDaysToggle = document.querySelector('.schedule-days-toggle');
	const scheduleDaysSelected = document.querySelector('.schedule-days-selected');
	
	if (scheduleDays && scheduleDaysToggle && scheduleDaysSelected) {
		const dayButtons = scheduleDays.querySelectorAll('.day-btn');
		const cards = document.querySelectorAll('.schedule .episodes-grid .card');

		// Toggle dropdown
		scheduleDaysToggle.addEventListener('click', function(e) {
			e.stopPropagation();
			scheduleDaysWrapper.classList.toggle('active');
		});

		// Close dropdown when clicking outside
		document.addEventListener('click', function(event) {
			if (scheduleDaysWrapper && !scheduleDaysWrapper.contains(event.target)) {
				scheduleDaysWrapper.classList.remove('active');
			}
		});

		dayButtons.forEach(button => {
			button.addEventListener('click', function() {
				// Remove active class from all buttons
				dayButtons.forEach(btn => btn.classList.remove('active'));
				// Add active class to clicked button
				this.classList.add('active');

				const selectedDay = this.getAttribute('data-day');
				const selectedText = this.textContent;

				// Update selected text in toggle button
				if (scheduleDaysSelected) {
					scheduleDaysSelected.textContent = selectedText;
				}

				// Filter cards
				cards.forEach(card => {
					if (selectedDay === 'all') {
						card.style.display = '';
					} else {
						const cardDay = card.getAttribute('data-day');
						if (cardDay === selectedDay) {
							card.style.display = '';
						} else {
							card.style.display = 'none';
						}
					}
				});

				// Close dropdown after selection
				scheduleDaysWrapper.classList.remove('active');
			});
		});
	}

	// Releases filters toggling
	const releasesContainer = document.querySelector('.releases');
	if (releasesContainer) {
		// Toggle chips (multi-select by default)
		releasesContainer.querySelectorAll('.filter-card').forEach(card => {
			const isSingle = card.hasAttribute('data-single');
			card.addEventListener('click', (e) => {
				const target = e.target.closest('.chip, .pill');
				if (!target) return;
				if (isSingle) {
					card.querySelectorAll('.chip.active, .pill.active').forEach(el => el.classList.remove('active'));
					target.classList.add('active');
				} else {
					target.classList.toggle('active');
				}
			});
		});
	}

	// Search toggle functionality for mobile
	const searchIconBtn = document.querySelector('.header-right .search-icon-btn');
	const searchBox = document.querySelector('.header-right .search-box');
	
	if (searchIconBtn && searchBox) {
		searchIconBtn.addEventListener('click', function(e) {
			e.stopPropagation();
			searchBox.classList.toggle('active');
			if (searchBox.classList.contains('active')) {
				const input = searchBox.querySelector('input');
				if (input) {
					setTimeout(() => input.focus(), 100);
				}
			}
		});
		
		// Close search when clicking outside
		document.addEventListener('click', function(event) {
			if (searchBox && !searchIconBtn.contains(event.target) && !searchBox.contains(event.target)) {
				searchBox.classList.remove('active');
			}
		});
	}
});
