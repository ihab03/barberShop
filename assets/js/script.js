document.addEventListener('DOMContentLoaded', () => {
    

    // TESTIMONIAL CAROUSEL LOGIC

    const reviews = [
        { text: "Best fade I've ever had, Mustafa is an absolute artist", author: "Ibrahim  T." },
        { text: "Highly recommend, I couldn't be happier with my cut!", author: "Ali O." },
        { text: "best barber in istanbul!", author: "Ihab A." }
    ];

    let currentReviewIndex = 0;
    const reviewText = document.getElementById('reviewText');
    const reviewAuthor = document.getElementById('reviewAuthor');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn && prevBtn) {
        function updateReview() {
            reviewText.textContent = `"${reviews[currentReviewIndex].text}"`;
            reviewAuthor.textContent = `- ${reviews[currentReviewIndex].author}`;
        }

        nextBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            updateReview();
        });

        prevBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
            updateReview();
        });
    }


    // BOOKING PAGE LOGIC 

    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        const dateInput = document.getElementById('date');
        const timeSelection = document.getElementById('timeSelection');
        const timeSlotsContainer = document.getElementById('timeSlots');
        const selectedTimeInput = document.getElementById('selectedTime');

        const handleDateSelection = (dateValue) => {
            if (dateValue) {
                timeSelection.style.display = 'block';
                timeSlotsContainer.innerHTML = ''; 
                selectedTimeInput.value = ''; 

                const times = ['10:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:30 PM'];
                
                times.forEach(time => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.classList.add('time-btn');
                    btn.textContent = time;

                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        selectedTimeInput.value = time;
                    });

                    timeSlotsContainer.appendChild(btn);
                });
            } else {
                timeSelection.style.display = 'none';
            }
        };

        if (typeof flatpickr !== 'undefined') {
            flatpickr(dateInput, {
                minDate: "today",
                dateFormat: "Y-m-d",
                disable: [
                    function(date) { return (date.getDay() === 0); } 
                ],
                onChange: function(selectedDates, dateStr, instance) {
                    handleDateSelection(dateStr);
                }
            });
        } else {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            dateInput.addEventListener('change', function() {
                handleDateSelection(this.value);
            });
        }

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!selectedTimeInput.value) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hold up!',
                        text: 'Please select a time slot for your appointment.',
                        background: '#1e1e1e',
                        color: '#ffffff',
                        confirmButtonColor: '#d4af37'
                    });
                } else {
                    alert('Please select a time slot for your appointment.');
                }
                return;
            }

            const newBooking = {
                name: document.getElementById('name').value,
                service: document.getElementById('service').options[document.getElementById('service').selectedIndex].text,
                date: dateInput.value,
                time: selectedTimeInput.value
            };

            let bookings = JSON.parse(localStorage.getItem('barberBookings')) || [];
            bookings.push(newBooking);
            localStorage.setItem('barberBookings', JSON.stringify(bookings));

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Confirmed!',
                    text: `You're locked in, ${newBooking.name}. See you on ${newBooking.date} at ${newBooking.time}.`,
                    background: '#1e1e1e',
                    color: '#ffffff',
                    confirmButtonColor: '#d4af37'
                }).then(() => {
                    bookingForm.reset();
                    timeSelection.style.display = 'none';
                });
            } else {
                alert(`Booking Confirmed! See you on ${newBooking.date} at ${newBooking.time}.`);
                bookingForm.reset();
                timeSelection.style.display = 'none';
            }
        });
    }


    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); 
                }
            });
        }, { 
            threshold: 0.15, 
            rootMargin: "0px 0px -50px 0px" 
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

});




