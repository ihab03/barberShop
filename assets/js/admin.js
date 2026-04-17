

    //  ADMIN DASHBOARD LOGIC
    const tableBody = document.getElementById('tableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const kpiTotalBookings = document.getElementById('kpiTotalBookings');
    const kpiRevenue = document.getElementById('kpiRevenue');

    if (tableBody) {
        let bookings = JSON.parse(localStorage.getItem('barberBookings')) || [];
        if (kpiTotalBookings) kpiTotalBookings.textContent = bookings.length;
        if (kpiRevenue) kpiRevenue.textContent = `$${bookings.length * 25}`;

        if (bookings.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${booking.name}</strong></td>
                    <td>${booking.service}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td><span class="status-badge"><i class="fa-solid fa-check-circle"></i> Confirmed</span></td>
                    <td>
                        <button class="action-btn" title="Edit Appointment"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

      
      
      
      


        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const rows = tableBody.querySelectorAll('tr');

                rows.forEach(row => {
                    const clientName = row.querySelectorAll('td')[0].textContent.toLowerCase();
                    
                    if (clientName.includes(searchTerm)) {
                        row.style.display = ''; 
                    } else {
                        row.style.display = 'none'; 
                    }
                });
            });
        }





    if (tableBody) {
        function renderAdminTable() {
            let bookings = JSON.parse(localStorage.getItem('barberBookings')) || [];

            if (kpiTotalBookings) kpiTotalBookings.textContent = bookings.length;
            if (kpiRevenue) kpiRevenue.textContent = `$${bookings.length * 25}`;

            tableBody.innerHTML = '';

            if (bookings.length === 0) {
                emptyMessage.style.display = 'block';
            } else {
                emptyMessage.style.display = 'none';
                bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

                bookings.forEach((booking, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${booking.name}</strong></td>
                        <td>${booking.service}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td><span class="status-badge"><i class="fa-solid fa-check-circle"></i> Confirmed</span></td>
                        <td>
                            <button class="action-btn delete-btn" data-index="${index}" title="Cancel Appointment">
                                <i class="fa-solid fa-trash-can" style="color: #dc3545;"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                attachDeleteListeners();
            }
        }


        function attachDeleteListeners() {
            const deleteButtons = document.querySelectorAll('.delete-btn');
            
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const indexToDelete = this.getAttribute('data-index');
                    let bookings = JSON.parse(localStorage.getItem('barberBookings')) || [];
                    bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Cancel Appointment?',
                            text: `Are you sure you want to cancel the booking for ${bookings[indexToDelete].name}?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#dc3545',
                            cancelButtonColor: '#444',
                            confirmButtonText: 'Yes, cancel it',
                            background: '#1e1e1e',
                            color: '#fff'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                bookings.splice(indexToDelete, 1);
                                localStorage.setItem('barberBookings', JSON.stringify(bookings));
                                renderAdminTable();

                                Swal.fire({
                                    title: 'Cancelled!',
                                    text: 'The appointment has been removed.',
                                    icon: 'success',
                                    background: '#1e1e1e',
                                    color: '#fff',
                                    confirmButtonColor: '#d4af37'
                                });
                            }
                        });
                    } else {
                        if (confirm(`Cancel the booking for ${bookings[indexToDelete].name}?`)) {
                            bookings.splice(indexToDelete, 1);
                            localStorage.setItem('barberBookings', JSON.stringify(bookings));
                            renderAdminTable();
                        }
                    }
                });
            });
        }
        renderAdminTable();

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const rows = tableBody.querySelectorAll('tr');

                rows.forEach(row => {
                    const clientName = row.querySelectorAll('td')[0].textContent.toLowerCase();
                    if (clientName.includes(searchTerm)) {
                        row.style.display = ''; 
                    } else {
                        row.style.display = 'none'; 
                    }
                });
            });
        }


        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                let currentBookings = JSON.parse(localStorage.getItem('barberBookings')) || [];
                currentBookings.sort((a, b) => new Date(a.date) - new Date(b.date));

                if (currentBookings.length === 0) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'info',
                            title: 'Nothing to Export',
                            text: 'You have no appointments booked yet.',
                            background: '#1e1e1e',
                            color: '#fff',
                            confirmButtonColor: '#d4af37'
                        });
                    } else {
                        alert('No data to export.');
                    }
                    return;
                }

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                doc.setFontSize(18);
                doc.setTextColor(212, 175, 55); 
                doc.text("Classic Cuts - Master Schedule", 14, 22);
                
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

                const tableColumn = ["Client Name", "Service", "Date", "Time"];
                const tableRows = [];

                currentBookings.forEach(booking => {
                    tableRows.push([booking.name, booking.service, booking.date, booking.time]);
                });

                doc.autoTable({
                    head: [tableColumn],
                    body: tableRows,
                    startY: 35,
                    theme: 'grid',
                    headStyles: { fillColor: [20, 20, 20], textColor: [212, 175, 55], fontStyle: 'bold' }, 
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    styles: { font: 'helvetica', fontSize: 10 }
                });

                doc.save('Classic_Cuts_Schedule.pdf');
            });
        }
    }