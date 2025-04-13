const transactions = [
    { id: 'TXN001', date: '2025-04-01', amount: -500 },
    { id: 'TXN002', date: '2025-04-03', amount: 1500 },
    { id: 'TXN003', date: '2025-03-28', amount: -300 },
    { id: 'TXN004', date: '2025-04-10', amount: 800 },
    { id: 'TXN005', date: '2025-05-01', amount: 500 },
    { id: 'TXN006', date: '2025-05-05', amount: -100 },
    { id: 'TXN007', date: '2025-05-12', amount: -50 }
  ];
  
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  
  function groupTransactionsByMonth(data) {
    const grouped = {};
    data.forEach(txn => {
      const [year, month] = txn.date.split("-");
      const key = `${year}-${month}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(txn);
    });
    return grouped;
  }
  
  function renderHistory(data = transactions) {
    const container = document.getElementById("historyContainer");
    container.innerHTML = "";
    const grouped = groupTransactionsByMonth(data);
  
    Object.keys(grouped).sort((a, b) => b.localeCompare(a)).forEach(key => {
      const txns = grouped[key];
      const [year, month] = key.split("-");
      const total = txns.reduce((sum, t) => sum + t.amount, 0);
      const section = document.createElement("div");
      section.className = "month-section";
  
      const header = document.createElement("div");
      header.className = "month-header";
      header.innerHTML = `
        <span>${monthNames[parseInt(month) - 1]} ${year}</span>
        <span class="${total < 0 ? 'negative' : 'positive'}">Total: ₹${total}</span>
      `;
      section.appendChild(header);
  
      txns.forEach(txn => {
        const txnDiv = document.createElement("div");
        txnDiv.className = "transaction";
        txnDiv.innerHTML = `
          <div>${txn.id}</div>
          <div>${txn.date}</div>
          <div class="transaction-amount ${txn.amount < 0 ? 'negative' : 'positive'}">₹${txn.amount}</div>
        `;
        section.appendChild(txnDiv);
      });
  
      container.appendChild(section);
    });
  }
  
  function sortBy(type) {
    const sorted = [...transactions].sort((a, b) => {
      if (type === 'date') return new Date(a.date) - new Date(b.date);
      if (type === 'amount') return Math.abs(b.amount) - Math.abs(a.amount);
    });
    renderHistory(sorted);
  }
  
  document.getElementById("modeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });
  
  // Initial render
  renderHistory();
  