// COLE AQUI A URL DO APP SCRIPT QUE VOCÊ COPIOU!
const API_URL = "https://script.google.com/macros/s/AKfycbwcGNYbuWSMAkUSMcj1mvfrPgrQS4SyecjNDlvf7yrD_dISiRZrAPLhmdrkz03JyMmx2g/exec";

// Elementos da página
const contentDiv = document.getElementById('dashboard-content');
const refreshBtn = document.getElementById('refresh');
const logoutBtn = document.getElementById('logout');

// Função principal para carregar dados
async function loadData() {
  const token = localStorage.getItem('mk2_token');
  if (!token) return window.location.href = 'login.html';
  
  try {
    contentDiv.innerHTML = "<p class='loading'>🔍 Carregando dados...</p>";
    const response = await fetch(`${API_URL}?token=${token}`);
    const data = await response.json();
    
    if (data.error) {
      contentDiv.innerHTML = `<p class="error">❌ ${data.error}</p>`;
      return;
    }
    
    renderDashboard(data);
  } catch (error) {
    contentDiv.innerHTML = `<p class="error">⚠️ Erro ao conectar com o servidor</p>`;
  }
}

// Mostrar dados no dashboard
function renderDashboard(data) {
  // Calcular totais
  const totalVendas = data.length;
  const totalVGV = data.reduce((sum, item) => sum + parseFloat(item.VGV || 0), 0);
  const vendasConcluidas = data.filter(item => item.Status === 'Vendida').length;
  
  let html = `
    <div class="kpi-container">
      <div class="kpi-card">
        <h3>Total de Vendas</h3>
        <p class="kpi-value">${totalVendas}</p>
      </div>
      <div class="kpi-card">
        <h3>VGV Total</h3>
        <p class="kpi-value">R$ ${totalVGV.toLocaleString('pt-BR')}</p>
      </div>
      <div class="kpi-card">
        <h3>Vendas Concluídas</h3>
        <p class="kpi-value">${vendasConcluidas}</p>
      </div>
    </div>
    <div class="chart-container">
      <canvas id="salesChart"></canvas>
    </div>
  `;
  
  contentDiv.innerHTML = html;
  
  // Gerar gráfico inicial
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Vendas'],
      datasets: [{
        label: 'Valor Total (VGV)',
        data: [totalVGV],
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Performance de Vendas'
        }
      }
    }
  });
}

// Função para logout
function logout() {
  localStorage.removeItem('mk2_token');
  window.location.href = 'login.html';
}

// Configurar eventos
refreshBtn.addEventListener('click', loadData);
logoutBtn.addEventListener('click', logout);

// Iniciar o dashboard
loadData();
