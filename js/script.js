 /* script.js — validações e envio do formulário (salve como public/script.js) */
(function () {
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
  const ALLOWED_TYPES = ['image/png','image/jpeg','image/jpg','application/pdf'];

  // elementos (assuma que o HTML tenha esses ids)
  const form = document.getElementById('formCadastro');
  if (!form) return; // evita erro se o script for carregado em página sem o form

  const tipoPessoa = document.getElementById('tipoPessoa');
  const cpfCnpj = document.getElementById('cpfCnpj');
  const nome = document.getElementById('nome');
  const municipio = document.getElementById('municipio');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const confirmarSenha = document.getElementById('confirmarSenha');
  const documentos = document.getElementById('documentos');
  const previews = document.getElementById('previews');
  const autorizo = document.getElementById('autorizo');
  const btnEnviar = document.getElementById('btnEnviar');
  const mensagemGeral = document.getElementById('mensagemGeral');

  const errNome = document.getElementById('errNome');
  const errCpfCnpj = document.getElementById('errCpfCnpj');
  const errMunicipio = document.getElementById('errMunicipio');
  const errEmail = document.getElementById('errEmail');
  const errSenha = document.getElementById('errSenha');
  const errConfirmarSenha = document.getElementById('errConfirmarSenha');
  const errDocumentos = document.getElementById('errDocumentos');
  const errAutorizo = document.getElementById('errAutorizo');

  const meterBar = document.getElementById('meterBar');
  const forcaText = document.getElementById('forcaText');

  function limpaDigitos(s){ return (s||'').replace(/\D/g,''); }

  function validaCPF(raw){
    const s = limpaDigitos(raw);
    if (s.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(s)) return false;
    const nums = s.split('').map(n=>parseInt(n,10));
    let soma = 0;
    for (let i=0;i<9;i++) soma += nums[i] * (10 - i);
    let dig1 = (soma * 10) % 11; if (dig1 === 10) dig1 = 0;
    if (dig1 !== nums[9]) return false;
    soma = 0;
    for (let i=0;i<10;i++) soma += nums[i] * (11 - i);
    let dig2 = (soma * 10) % 11; if (dig2 === 10) dig2 = 0;
    return dig2 === nums[10];
  }

  function validaCNPJ(raw){
    const s = limpaDigitos(raw);
    if (s.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(s)) return false;
    const nums = s.split('').map(n=>parseInt(n,10));
    const calc = (t)=>{
      const pesos = t === 1 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2];
      let soma = 0;
      for (let i=0;i<pesos.length;i++) soma += nums[i] * pesos[i];
      let r = soma % 11;
      return r < 2 ? 0 : 11 - r;
    };
    const d1 = calc(1);
    if (d1 !== nums[12]) return false;
    const d2 = calc(2);
    return d2 === nums[13];
  }

  function validaEmail(v){ return /^\S+@\S+\.\S+$/.test(v||''); }

  function senhaScore(s){
    let score = 0;
    if (s.length >= 8) score += 2;
    if (/[a-z]/.test(s)) score += 1;
    if (/[A-Z]/.test(s)) score += 1;
    if (/\d/.test(s)) score += 1;
    if (/[^A-Za-z0-9]/.test(s)) score += 1;
    return score;
  }

  function setMeter(score){
    if (!meterBar || !forcaText) return;
    const pct = Math.round((score/6) * 100);
    meterBar.style.width = pct + '%';
    meterBar.style.background = score <= 2 ? '#ef4444' : score <= 4 ? '#f59e0b' : '#10b981';
    forcaText.textContent = score <= 2 ? 'Fraca' : score <= 4 ? 'Média' : 'Forte';
  }

  function renderPreviews(files){
    if (!previews) return;
    previews.innerHTML = '';
    const arr = Array.from(files);
    arr.forEach(file=>{
      const div = document.createElement('div');
      div.className = 'preview-thumb';
      if (file.type === 'application/pdf'){
        div.textContent = file.name.length>12 ? file.name.slice(0,12)+'…' : file.name;
      } else if (file.type.startsWith('image/')){
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = ()=> URL.revokeObjectURL(img.src);
        div.appendChild(img);
      } else {
        div.textContent = file.name;
      }
      previews.appendChild(div);
    });
  }

  function limpaErros(){
    [errNome, errCpfCnpj, errMunicipio, errEmail, errSenha, errConfirmarSenha, errDocumentos, errAutorizo].forEach(el=>{
      if (el) el.textContent = '';
    });
    if (mensagemGeral) mensagemGeral.textContent = '';
  }

  function validarFormulario(){
    limpaErros();
    let ok = true;
    if (!nome.value.trim()){ if (errNome) errNome.textContent = 'Nome é obrigatório.'; ok = false; }
    const tipo = tipoPessoa ? tipoPessoa.value : 'pf';
    const card = limpaDigitos(cpfCnpj.value || '');
    if (!card){ if (errCpfCnpj) errCpfCnpj.textContent = 'CPF ou CNPJ é obrigatório.'; ok = false; }
    else {
      if (tipo === 'pf'){
        if (!/^\d{11}$/.test(card)){ if (errCpfCnpj) errCpfCnpj.textContent = 'CPF deve ter 11 dígitos.'; ok = false; }
        else if (!validaCPF(card)){ if (errCpfCnpj) errCpfCnpj.textContent = 'CPF inválido.'; ok = false; }
      } else {
        if (!/^\d{14}$/.test(card)){ if (errCpfCnpj) errCpfCnpj.textContent = 'CNPJ deve ter 14 dígitos.'; ok = false; }
        else if (!validaCNPJ(card)){ if (errCpfCnpj) errCpfCnpj.textContent = 'CNPJ inválido.'; ok = false; }
      }
    }
    if (!municipio.value.trim()){ if (errMunicipio) errMunicipio.textContent = 'Município é obrigatório.'; ok = false; }
    if (!validaEmail(email.value)){ if (errEmail) errEmail.textContent = 'E-mail inválido.'; ok = false; }
    if (!senha.value){ if (errSenha) errSenha.textContent = 'Senha é obrigatória.'; ok = false; }
    else if (senha.value.length < 8){ if (errSenha) errSenha.textContent = 'Senha muito curta (mínimo 8).'; ok = false; }
    if (senha.value !== confirmarSenha.value){ if (errConfirmarSenha) errConfirmarSenha.textContent = 'Senhas não conferem.'; ok = false; }
    if (!autorizo.checked){ if (errAutorizo) errAutorizo.textContent = 'Você precisa autorizar o uso dos dados.'; ok = false; }

    // arquivos
    const files = documentos.files || [];
    if (files.length > MAX_FILES){ if (errDocumentos) errDocumentos.textContent = 'Máximo ' + MAX_FILES + ' arquivos.'; ok = false; }
    for (let f of files){
      if (!ALLOWED_TYPES.includes(f.type)){ if (errDocumentos) errDocumentos.textContent = 'Tipo de arquivo inválido: ' + f.name; ok = false; break; }
      if (f.size > MAX_FILE_SIZE){ if (errDocumentos) errDocumentos.textContent = 'Arquivo muito grande: ' + f.name; ok = false; break; }
    }
    return ok;
  }

  // eventos
  if (senha) senha.addEventListener('input', ()=> setMeter(senhaScore(senha.value)));
  if (tipoPessoa) tipoPessoa.addEventListener('change', ()=> {
    if (cpfCnpj) cpfCnpj.placeholder = tipoPessoa.value === 'pf' ? 'CPF — apenas números (11 dígitos)' : 'CNPJ — apenas números (14 dígitos)';
  });
  if (documentos) documentos.addEventListener('change', (e)=> renderPreviews(e.target.files));

  if (form) form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    const fd = new FormData(form);
    // já inclui inputs do form; se quiser garantir, adiciona manualmente:
    // fd.append('cpfCnpj', limpaDigitos(cpfCnpj.value));

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    if (mensagemGeral) mensagemGeral.textContent = 'Enviando cadastro — aguarde.';

    try {
      const res = await fetch('/api/membros/register', { method: 'POST', body: fd });
      if (!res.ok) {
        let data = null;
        try { data = await res.json(); } catch (_){ }
        throw new Error((data && data.message) ? data.message : 'Erro no servidor ao enviar o cadastro.');
      }
      if (mensagemGeral) {
        mensagemGeral.style.color = '#064e3b';
        mensagemGeral.textContent = 'Cadastro enviado com sucesso. A Federação avaliará e confirmará por e-mail.';
      }
      form.reset();
      if (previews) previews.innerHTML = '';
      setMeter(0);
    } catch (err) {
      if (mensagemGeral) mensagemGeral.textContent = 'Erro: ' + (err.message || 'Falha ao enviar.');
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar cadastro';
      setTimeout(()=> { if (mensagemGeral) mensagemGeral.style.color = ''; }, 6000);
    }
  });

  // inicialização
  if (tipoPessoa) tipoPessoa.dispatchEvent(new Event('change'));
})();

