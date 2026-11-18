import { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:8080';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

const getCarImage = (modelo = '', marca = '') => {
  const text = `${marca} ${modelo}`.toLowerCase();
  if (text.includes('civic') || text.includes('corolla') || text.includes('sedan')) return '/carros/sedan.jpg';
  if (text.includes('jeep') || text.includes('compass') || text.includes('suv') || text.includes('tracker')) return '/carros/suv.jpg';
  if (text.includes('onix') || text.includes('hb20') || text.includes('polo') || text.includes('argo')) return '/carros/hatch.jpg';
  return '/carros/padrao.jpg';
};

export default function App() {

  const [user, setUser] = useState(null); 
  const [authMode, setAuthMode] = useState('LOGIN');
  const [role, setRole] = useState('CLIENTE');
  const [formAuth, setFormAuth] = useState({
    nome: '', cpf: '', cnpj: '', rg: '', endereco: '', profissao: '', senha: ''
  });

  const [activeTab, setActiveTab] = useState('CATALOGO');
  const [menuOpen, setMenuOpen] = useState(false);
  const [busca, setBusca] = useState('');

  const [automoveis, setAutomoveis] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [novoCarro, setNovoCarro] = useState({
    marca: '', modelo: '', ano: 2025, placa: '', matricula: ''
  });
  const [perfil, setPerfil] = useState({
    nome: '', cpf: '', rg: '', endereco: '', profissao: ''
  });

  const anoMaximo = new Date().getFullYear() + 1;

  const carregarDados = async () => {
    try {
      const [resCarros, resPedidos] = await Promise.all([
        fetch(`${API}/automoveis`),
        fetch(`${API}/pedidos`)
      ]);
      if (resCarros.ok) setAutomoveis(await resCarros.json());
      if (resPedidos.ok) setPedidos(await resPedidos.json());
    } catch (err) {
      console.error('Erro ao conectar no back-end:', err);
    }
  };

  useEffect(() => {
    if (user) carregarDados();
  }, [user]);
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const isCliente = role === 'CLIENTE';
    const baseEndpoint = isCliente ? `${API}/clientes` : `${API}/agentes`;

    try {
      if (authMode === 'LOGIN') {
        const body = isCliente
          ? { cpf: formAuth.cpf, senha: formAuth.senha }
          : { cnpj: formAuth.cnpj, senha: formAuth.senha };

        const res = await fetch(`${baseEndpoint}/login`, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(body)
        });
        const data = await res.json().catch(() => null);

        if (data && data.id) {
          setUser({ ...data, role });
          setActiveTab(isCliente ? 'CATALOGO' : 'PAINEL_AGENTE');
        } else {
          alert('Credenciais não encontradas! Verifique CPF/CNPJ e senha ou crie uma conta.');
        }
      } else {
        const res = await fetch(baseEndpoint, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(formAuth)
        });
        const data = await res.json().catch(() => null);
        if (data && data.id) {
          alert('Conta criada com sucesso! Entrando no sistema...');
          setUser({ ...data, role });
          setActiveTab(isCliente ? 'CATALOGO' : 'PAINEL_AGENTE');
        } else {
          alert('Não foi possível criar a conta. Confira os dados e tente de novo.');
        }
      }
    } catch {
      alert('Não foi possível conectar ao servidor Spring Boot (porta 8080).');
    }
  };

  const solicitarAluguel = async (carro) => {
    const dataHoje = new Date().toLocaleDateString('sv-SE');
    const novoPedido = {
      cliente: { id: user.id },
      automovel: { id: carro.id },
      dataPedido: dataHoje,
      status: 'PENDENTE'
    };

    const res = await fetch(`${API}/pedidos`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(novoPedido)
    });

    if (res.ok) {
      alert(`Pedido de aluguel do ${carro.marca} ${carro.modelo} enviado com sucesso!`);
      carregarDados();
      setActiveTab('MEUS_PEDIDOS');
    } else {
      alert('Não foi possível enviar o pedido.');
    }
  };

  const alterarStatusPedido = async (id, novoStatus) => {
    if (novoStatus === 'CANCELADO' && !window.confirm('Deseja cancelar este pedido?')) return;

    await fetch(`${API}/pedidos/${id}/status`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(novoStatus)
    });
    carregarDados();
  };

  const handleCadastrarCarro = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/automoveis`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...novoCarro, ano: Number(novoCarro.ano) })
    });
    if (res.ok) {
      alert('Carro cadastrado com sucesso!');
      setNovoCarro({ marca: '', modelo: '', ano: 2025, placa: '', matricula: '' });
      carregarDados();
    } else { alert('Dados inválidos. Confira ano e placa.'); }
  };

  const excluirCarro = async (carro) => {
  if (!window.confirm(`Excluir ${carro.marca} ${carro.modelo} (${carro.placa}) da frota?`)) return;
  try {
    const res = await fetch(`${API}/automoveis/${carro.id}`, { method: 'DELETE' });
    if (res.ok) {
      carregarDados();
    } else {
      alert('Não foi possível excluir: o carro possui pedidos vinculados.');
    }
  } catch {
    alert('Não foi possível conectar ao servidor Spring Boot (porta 8080).');
  }
};

  const popularFrotaExemplo = async () => {
    const exemplos = [
      { marca: 'Honda', modelo: 'Civic Touring', ano: 2024, placa: 'ABC-1D23', matricula: 'MAT-101' },
      { marca: 'Jeep', modelo: 'Compass Longitude', ano: 2025, placa: 'XYZ-9K88', matricula: 'MAT-102' },
      { marca: 'Hyundai', modelo: 'HB20 Platinum', ano: 2024, placa: 'QWE-4R56', matricula: 'MAT-103' }
    ];
    for (const carro of exemplos) {
      await fetch(`${API}/automoveis`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(carro)
      });
    }
    carregarDados();
  };

  const abrirPerfil = () => {
    setPerfil({
      nome: user.nome || '',
      cpf: user.cpf || '',
      rg: user.rg || '',
      endereco: user.endereco || '',
      profissao: user.profissao || ''
    });
    setActiveTab('PERFIL');
    setMenuOpen(false);
  };

  const salvarPerfil = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/clientes/${user.id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(perfil)
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, ...data });
        alert('Dados atualizados com sucesso!');
      } else {
        alert('Não foi possível atualizar os dados.');
      }
    } catch {
      alert('Não foi possível conectar ao servidor Spring Boot (porta 8080).');
    }
  };

  const excluirConta = async () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.')) return;
    try {
      const res = await fetch(`${API}/clientes/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Conta excluída.');
        setUser(null);
      } else {
        alert('Não foi possível excluir: sua conta possui pedidos vinculados.');
      }
    } catch {
      alert('Não foi possível conectar ao servidor Spring Boot (porta 8080).');
    }
  };

  if (!user) {
    const bgIcons = ['🚗', '🔑', '📍', '📅', '🚘', '🛡️'];
    return (
      <div className="login-page">
        <div className="bg-icons">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i}>{bgIcons[i % bgIcons.length]}</span>
          ))}
        </div>

        <div className="login-card">
          <div className="avatar-circle">👤</div>
          <h2>Loca Cars</h2>
          <p className="subtitle">Alugando carros desde 2026</p>

          <div className="tabs">
            <button
              type="button"
              className={authMode === 'LOGIN' ? 'active' : ''}
              onClick={() => setAuthMode('LOGIN')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={authMode === 'REGISTER' ? 'active' : ''}
              onClick={() => setAuthMode('REGISTER')}
            >
              Criar Conta
            </button>
          </div>

          <div className="role-selector">
            <button
              type="button"
              className={role === 'CLIENTE' ? 'active' : ''}
              onClick={() => setRole('CLIENTE')}
            >
              Sou Cliente
            </button>
            <button
              type="button"
              className={role === 'AGENTE' ? 'active' : ''}
              onClick={() => setRole('AGENTE')}
            >
              Sou Agente / Banco
            </button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            {authMode === 'REGISTER' && (
              <div className="form-group">
                <label>{role === 'CLIENTE' ? 'Nome Completo' : 'Razão Social / Nome do Agente'}</label>
                <input
                  required
                  value={formAuth.nome}
                  onChange={(e) => setFormAuth({ ...formAuth, nome: e.target.value })}
                />
              </div>
            )}

            {role === 'CLIENTE' ? (
              <div className="form-group">
                <label>CPF</label>
                <input
                  required
                  inputMode="numeric"
                  pattern="\d{11}"
                  title="Digite os 11 números do CPF, sem pontos nem traço"
                  placeholder="Apenas números (11)"
                  value={formAuth.cpf}
                  onChange={(e) => setFormAuth({ ...formAuth, cpf: e.target.value })}
                />
              </div>
            ) : (
              <div className="form-group">
                <label>CNPJ</label>
                <input
                  required
                  inputMode="numeric"
                  pattern="\d{14}"
                  title="Digite os 14 números do CNPJ, sem pontos, barra nem traço"
                  placeholder="Apenas números (14)"
                  value={formAuth.cnpj}
                  onChange={(e) => setFormAuth({ ...formAuth, cnpj: e.target.value })}
                />
              </div>
            )}

            {authMode === 'REGISTER' && role === 'CLIENTE' && (
              <>
                <div className="form-group">
                  <label>RG</label>
                  <input
                    required
                    value={formAuth.rg}
                    onChange={(e) => setFormAuth({ ...formAuth, rg: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Endereço</label>
                  <input
                    required
                    value={formAuth.endereco}
                    onChange={(e) => setFormAuth({ ...formAuth, endereco: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Profissão</label>
                  <input
                    required
                    value={formAuth.profissao}
                    onChange={(e) => setFormAuth({ ...formAuth, profissao: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                required
                value={formAuth.senha}
                onChange={(e) => setFormAuth({ ...formAuth, senha: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary">
              {authMode === 'LOGIN' ? 'Acessar Sistema' : 'Cadastrar e Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const carrosFiltrados = automoveis.filter((c) =>
    `${c.marca} ${c.modelo} ${c.placa}`.toLowerCase().includes(busca.toLowerCase())
  );

  const meusPedidos = pedidos.filter((p) => p.cliente?.id === user.id);

  const irPara = (aba) => {
    setActiveTab(aba);
    setMenuOpen(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="brand">Loca Cars</div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {user.role === 'CLIENTE' ? (
            <>
              <button
                className={activeTab === 'CATALOGO' ? 'active' : ''}
                onClick={() => irPara('CATALOGO')}
              >
                Catálogo de Carros
              </button>
              <button
                className={activeTab === 'MEUS_PEDIDOS' ? 'active' : ''}
                onClick={() => irPara('MEUS_PEDIDOS')}
              >
                Meus Pedidos ({meusPedidos.length})
              </button>
              <button
                className={activeTab === 'PERFIL' ? 'active' : ''}
                onClick={abrirPerfil}
              >
                Meu Perfil
              </button>
            </>
          ) : (
            <button
              className={activeTab === 'PAINEL_AGENTE' ? 'active' : ''}
              onClick={() => irPara('PAINEL_AGENTE')}
            >
              Painel do Agente
            </button>
          )}

          {user.role === 'CLIENTE' && activeTab === 'CATALOGO' && (
            <input
              className="search-box"
              placeholder="Buscar marca, modelo ou placa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          )}

          <button className="btn-logout" onClick={() => setUser(null)}>
            Sair ({user.nome.split(' ')[0]})
          </button>
        </div>
      </nav>

      {user.role === 'CLIENTE' && (
        <div className="container">
          {activeTab === 'CATALOGO' && (
            <>
              <div className="header-bar">
                <h1>Veículos Disponíveis para Aluguel</h1>
                {automoveis.length === 0 && (
                  <button className="btn-secondary" onClick={popularFrotaExemplo}>
                    + Carregar 3 Carros de Exemplo
                  </button>
                )}
              </div>

              {carrosFiltrados.length === 0 && automoveis.length > 0 ? (
                <div className="panel vazio">
                  <h3>Não temos esse veículo</h3>
                  <p>
                    Nenhum carro encontrado para "<strong>{busca}</strong>". Tente outra marca, modelo ou placa.
                  </p>
                </div>
              ) : (
                <div className="car-grid">
                  {carrosFiltrados.map((carro) => (
                    <div className="car-card" key={carro.id}>
                      <img src={getCarImage(carro.modelo, carro.marca)} alt={carro.modelo} />
                      <div className="car-body">
                        <div>
                          <span className="badge-available">Disponível</span>
                          <div className="car-title">{carro.marca} {carro.modelo}</div>
                          <div className="car-meta">
                            Ano: <strong>{carro.ano}</strong> • Placa: <strong>{carro.placa}</strong><br />
                            Matrícula: {carro.matricula}
                          </div>
                        </div>
                        <button className="btn-primary" onClick={() => solicitarAluguel(carro)}>
                          Solicitar Aluguel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'MEUS_PEDIDOS' && (
            <div className="panel">
              <h3>Meus Pedidos de Aluguel</h3>
              {meusPedidos.length === 0 ? (
                <p>Você ainda não possui pedidos registrados.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Automóvel</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meusPedidos.map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td>{p.automovel ? `${p.automovel.marca} ${p.automovel.modelo}` : 'Veículo'}</td>
                        <td>{p.dataPedido}</td>
                        <td><span className={`status-pill status-${p.status}`}>{p.status}</span></td>
                        <td>
                          {p.status === 'PENDENTE' && (
                            <button className="btn-reject" onClick={() => alterarStatusPedido(p.id, 'CANCELADO')}>
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'PERFIL' && (
            <div className="panel">
              <h3>Meu Perfil</h3>
              <form className="inline-form" onSubmit={salvarPerfil}>
                <div className="form-group">
                  <label>Nome</label>
                  <input required value={perfil.nome}
                    onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CPF</label>
                  <input required inputMode="numeric" pattern="\d{11}"
                    title="Digite os 11 números do CPF, sem pontos nem traço"
                    value={perfil.cpf}
                    onChange={(e) => setPerfil({ ...perfil, cpf: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>RG</label>
                  <input required value={perfil.rg}
                    onChange={(e) => setPerfil({ ...perfil, rg: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Endereço</label>
                  <input required value={perfil.endereco}
                    onChange={(e) => setPerfil({ ...perfil, endereco: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Profissão</label>
                  <input required value={perfil.profissao}
                    onChange={(e) => setPerfil({ ...perfil, profissao: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary">Salvar alterações</button>
              </form>

              <div className="action-btns" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-reject" onClick={excluirConta}>
                  Excluir minha conta
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {user.role === 'AGENTE' && (
        <div className="container">
          <div className="panel">
            <h3>Solicitações de Aluguel (Parecer do Agente)</h3>
            {pedidos.length === 0 ? (
              <p>Nenhum pedido registrado até o momento.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Automóvel</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Avaliação</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.cliente?.nome || 'Cliente'} (CPF: {p.cliente?.cpf})</td>
                      <td>{p.automovel?.marca} {p.automovel?.modelo} ({p.automovel?.placa})</td>
                      <td>{p.dataPedido}</td>
                      <td><span className={`status-pill status-${p.status}`}>{p.status}</span></td>
                      <td>
                        {p.status === 'PENDENTE' && (
                          <div className="action-btns">
                            <button className="btn-approve" onClick={() => alterarStatusPedido(p.id, 'APROVADO')}>
                              Aprovar
                            </button>
                            <button className="btn-reject" onClick={() => alterarStatusPedido(p.id, 'REPROVADO')}>
                              Reprovar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

                    <div className="panel">
            <h3>Frota cadastrada ({automoveis.length})</h3>
            {automoveis.length === 0 ? (
              <p>Nenhum carro cadastrado.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Ano</th>
                    <th>Placa</th>
                    <th>Matrícula</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {automoveis.map((c) => (
                    <tr key={c.id}>
                      <td>{c.marca}</td>
                      <td>{c.modelo}</td>
                      <td>{c.ano}</td>
                      <td>{c.placa}</td>
                      <td>{c.matricula}</td>
                      <td>
                        <button className="btn-reject" onClick={() => excluirCarro(c)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <h3>Cadastrar Novo Automóvel na Frota</h3>
            <form className="inline-form" onSubmit={handleCadastrarCarro}>
              <div className="form-group">
                <label>Marca</label>
                <input required placeholder="Ex: Toyota" value={novoCarro.marca}
                  onChange={(e) => setNovoCarro({ ...novoCarro, marca: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input required placeholder="Ex: Corolla" value={novoCarro.modelo}
                  onChange={(e) => setNovoCarro({ ...novoCarro, modelo: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Ano</label>
                <input type="number" required min="1950" max={anoMaximo} value={novoCarro.ano}
                  onChange={(e) => setNovoCarro({ ...novoCarro, ano: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Placa</label>
                <input required placeholder="ABC-1D23"
                  pattern="[A-Za-z]{3}-?[0-9][A-Za-z0-9][0-9]{2}"
                  title="Formato da placa, por exemplo ABC-1D23"
                  value={novoCarro.placa}
                  onChange={(e) => setNovoCarro({ ...novoCarro, placa: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Matrícula</label>
                <input required placeholder="MAT-200" value={novoCarro.matricula}
                  onChange={(e) => setNovoCarro({ ...novoCarro, matricula: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary">Adicionar Carro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}