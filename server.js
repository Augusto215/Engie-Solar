import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'
import { supabase } from './public/supabaseClient.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carrega variáveis de ambiente
dotenv.config()

const app = express()
const upload = multer({ dest: 'uploads/' })
const BUCKET = 'engie-projetos'
const tables = ['engie_header', 'engie_footer', 'engie_hero', 'engie_estatisticas', 'engie_depoimentos', 'engie_diferenciais', 'engie_projetos', 'engie_visao', 'engie_solucoes']

// Configura EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Página protegida (HTML direto)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'))
})

// Painel principal com dados do Supabase
app.get('/admin', async (req, res) => {
  const data = {}

  for (const table of tables) {
    const { data: rows, error } = await supabase.from(table).select('*')
    if (error) return res.status(500).send(`Erro na tabela ${table}: ${error.message}`)
    console.log(`[✓] Dados carregados de ${table} (${rows?.length || 0} registros)`)
    data[table] = rows
  }

  res.render('index', { data })
})

// No seu index.js, adicione estas rotas:

// API para Header
app.get('/api/header', async (req, res) => {
  const { data, error } = await supabase.from('engie_header').select('*').limit(1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || {});
});

// API para Footer
app.get('/api/footer', async (req, res) => {
  const { data, error } = await supabase.from('engie_footer').select('*').limit(1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || {});
});

// API para Estatisticas
app.get('/api/estatisticas', async (req, res) => {
  const { data, error } = await supabase.from('engie_estatisticas').select('*').limit(1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || {});
});

// API pública para diferenciais
app.get('/api/header', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('engie_header')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error

    res.json(data || {})
  } catch (err) {
    console.error('[X] API /api/diferenciais:', err.message)
    res.status(500).json({ error: err.message })
  }
})


app.get('/api/hero', async (req, res) => {
  const { data, error } = await supabase.from('engie_hero').select('*').limit(1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || {});
});



// API pública para diferenciais
app.get('/api/footer', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('engie_footer')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error

    res.json(data || {})
  } catch (err) {
    console.error('[X] API /api/diferenciais:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// API pública para diferenciais
app.get('/api/diferenciais', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('engie_diferenciais')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error

    res.json(data || {})
  } catch (err) {
    console.error('[X] API /api/diferenciais:', err.message)
    res.status(500).json({ error: err.message })
  }
})


app.get('/api/solucoes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('engie_solucoes')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error

    res.json(data || {})
  } catch (err) {
    console.error('[X] API /api/solucoes:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/visao', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('engie_visao')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error

    res.json(data || {})
  } catch (err) {
    console.error('[X] API /api/visao:', err.message)
    res.status(500).json({ error: err.message })
  }
})



// Editar registro
app.get('/edit/:tabela/:id', async (req, res) => {
  const { tabela, id } = req.params

  if (!tables.includes(tabela)) return res.status(400).send('Tabela inválida')

  const { data, error } = await supabase.from(tabela).select('*').eq('id', parseInt(id)).single()
  if (error || !data) return res.status(404).send('Item não encontrado')

  res.render('edit', { section: data, tabela })
})



// Upload de imagem para Supabase Storage, com logs detalhados
app.post('/upload-image/:tabela/:campo/:id', upload.single('imagem'), async (req, res) => {
  const { tabela, campo, id } = req.params
  console.log(`[upload-image] Iniciando requisição: tabela=${tabela}, campo=${campo}, id=${id}`)
  
  if (!tables.includes(tabela)) {
    console.error(`[upload-image] Tabela inválida: ${tabela}`)
    return res.status(400).send('Tabela inválida')
  }

  const file = req.file
  if (!file) {
    console.error('[upload-image] Nenhum arquivo enviado')
    return res.status(400).send('Nenhum arquivo enviado')
  }
  console.log(`[upload-image] Arquivo recebido: originalname=${file.originalname}, size=${file.size} bytes`)

  const ext = path.extname(file.originalname)
  const filePath = `${tabela}/${campo}_${id}${ext}`
  console.log(`[upload-image] Gerando filePath: ${filePath}`)

  let buffer
  try {
    buffer = fs.readFileSync(file.path)
    console.log(`[upload-image] Buffer criado, lendo de ${file.path}`)
  } catch (err) {
    console.error('[upload-image] Erro ao ler buffer do arquivo:', err)
    return res.status(500).send('Erro interno ao processar arquivo')
  }

  console.log('[upload-image] Iniciando upload para o Storage...')
  const { error: uploadError } = await supabase
    .storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      upsert: true,
      contentType: file.mimetype,
    })

  fs.unlinkSync(file.path)
  console.log(`[upload-image] Arquivo temporário removido: ${file.path}`)

  if (uploadError) {
    console.error('[upload-image] Erro ao subir imagem para o Storage:', uploadError)
    return res.status(500).send('Erro ao subir imagem')
  }
  console.log('[upload-image] Upload bem-sucedido.')

  const { data: publicUrlData, error: urlError } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  if (urlError) {
    console.error('[upload-image] Erro ao gerar URL pública:', urlError)
    return res.status(500).send('Erro ao gerar URL da imagem')
  }
  const imageUrl = publicUrlData.publicUrl
  console.log(`[upload-image] URL pública obtida: ${imageUrl}`)

  console.log(`[upload-image] Atualizando tabela ${tabela}, definindo ${campo} = URL para id=${id}`)
  const { error: updateError } = await supabase
    .from(tabela)
    .update({ [campo]: imageUrl })
    .eq('id', parseInt(id, 10))

  if (updateError) {
    console.error('[upload-image] Erro ao salvar URL no banco:', updateError)
    return res.status(500).send('Erro ao salvar URL no banco')
  }
  console.log('[upload-image] Registro atualizado com sucesso.')

  // Correção: devolve apenas a URL, não faz redirect
  return res
    .status(200)
    .send(imageUrl)
})



// Salvar edição de texto
app.post('/edit/:tabela/:id', upload.none(), async (req, res) => {
  const { tabela, id } = req.params
  console.log(`🛠️ Requisição recebida para editar tabela '${tabela}' com id = ${id}`)

  if (!tables.includes(tabela)) {
    console.warn(`❌ Tabela inválida: ${tabela}`)
    return res.status(400).send('Tabela inválida')
  }

  console.log('📥 Dados recebidos no body:', req.body)

  const updateFields = {}
  for (const key in req.body) {
    if (key !== 'id' && typeof req.body[key] === 'string') {
      const raw = req.body[key].trim()
      if (raw && !raw.startsWith('<!DOCTYPE')) {
        updateFields[key] = raw.replace(/^"|"$/g, '')
      }
    }
  }

  if (Object.keys(updateFields).length === 0) {
    console.warn('⚠️ Nenhum campo válido para atualizar.')
  }

  console.log('📝 Campos a serem atualizados:', updateFields)

  const { error } = await supabase
    .from(tabela)
    .update(updateFields)
    .eq('id', parseInt(id))

  if (error) {
    console.error('❌ Erro Supabase ao atualizar:', error)
    return res.status(500).send(`Erro ao atualizar dados: ${error.message}`)
  }

  console.log('✅ Atualização concluída com sucesso')
  res.redirect('/admin')
})


// Remover imagem (só no banco, não do storage)
app.post('/delete-image/:tabela/:campo/:id', async (req, res) => {
  const { tabela, campo, id } = req.params

  if (!tables.includes(tabela)) return res.status(400).send('Tabela inválida')

  const { error } = await supabase
    .from(tabela)
    .update({ [campo]: '' })
    .eq('id', parseInt(id))

  if (error) return res.status(500).send('Erro ao apagar imagem')

  res.type('text/plain').send('Imagem apagada com sucesso')
})

// Inicializa servidor
const PORT = 4000
app.listen(PORT, () => console.log(`✅ Painel rodando em http://localhost:${PORT}`))
