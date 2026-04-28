document.addEventListener('DOMContentLoaded', () => {
    
    const tableBody = document.getElementById('tableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const kpiTotalBookings = document.getElementById('kpiTotalBookings');
    const kpiRevenue = document.getElementById('kpiRevenue');


    const API_URL = 'https://69f06310112e1b968e25b1cf.mockapi.io/bookings';

    if (tableBody) {
        
        async function renderAdminTable() {
            try {
                const response = await fetch(API_URL);
                let bookings = await response.json();


                if (kpiTotalBookings) kpiTotalBookings.textContent = bookings.length;
                if (kpiRevenue) kpiRevenue.textContent = `$${bookings.length * 25}`;

                tableBody.innerHTML = '';

                if (bookings.length === 0) {
                    emptyMessage.style.display = 'block';
                } else {
                    emptyMessage.style.display = 'none';

                    bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

                    bookings.forEach((booking) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td><strong>${booking.name}</strong></td>
                            <td>${booking.service}</td>
                            <td>${booking.date}</td>
                            <td>${booking.time}</td>
                            <td><span class="status-badge"><i class="fa-solid fa-check-circle"></i> Confirmed</span></td>
                            <td>
                                <button class="action-btn delete-btn" data-id="${booking.id}" title="Cancel Appointment">
                                    <i class="fa-solid fa-trash-can" style="color: #dc3545;"></i>
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });

                    attachDeleteListeners();
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

  
        function attachDeleteListeners() {
            const deleteButtons = document.querySelectorAll('.delete-btn');
            
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const dbIdToDelete = this.getAttribute('data-id');

                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Cancel Appointment?',
                            text: "This will permanently delete the record from the database.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#dc3545',
                            cancelButtonColor: '#444',
                            confirmButtonText: 'Yes, cancel it',
                            background: '#1e1e1e',
                            color: '#fff'
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                try {
                                    await fetch(`${API_URL}/${dbIdToDelete}`, {
                                        method: 'DELETE'
                                    });
                                    
                                    renderAdminTable();

                                    Swal.fire({
                                        title: 'Cancelled!',
                                        text: 'Record deleted from database.',
                                        icon: 'success',
                                        background: '#1e1e1e',
                                        color: '#fff',
                                        confirmButtonColor: '#d4af37'
                                    });
                                } catch (error) {
                                    console.error("Failed to delete record:", error);
                                }
                            }
                        });
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
            exportBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(API_URL);
                    let currentBookings = await response.json();
                    
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
                } catch(error) {
                    console.error("Export failed:", error);
                }
            });
        }
    }
});