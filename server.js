import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'
import { supabase } from './public/supabaseClient.js'
import path from 'path'
import fs from 'fs'




dotenv.config()

const app = express()
const upload = multer({ dest: 'uploads/' }) // pasta temporária
const BUCKET = 'engie-projetos'
const tables = ['engie_depoimentos', 'engie_diferenciais', 'engie_projetos', 'engie_visao']

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Painel principal
app.get('/', async (req, res) => {
  const data = {}

  for (const table of tables) {
    const { data: rows, error } = await supabase.from(table).select('*')
    if (error) return res.status(500).send(`Erro na tabela ${table}: ${error.message}`)
    console.log(`[✓] Dados carregados de ${table} (${rows?.length || 0} registros)`)
    data[table] = rows
  }

  res.render('index', { data })
})


// API pública para diferenciais
app.get('/api/diferenciais', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('engie_diferenciais')
      .select('*')
      .limit(1)
      .maybeSingle(); // <- atenção aqui

    if (error) throw error;

    res.json(data || {});
  } catch (err) {
    console.error('[X] API /api/diferenciais:', err.message);
    res.status(500).json({ error: err.message });
  }
});






app.get('/edit/:tabela/:id', async (req, res) => {
  const { tabela, id } = req.params;

  if (!tables.includes(tabela)) {
    return res.status(400).send('Tabela inválida');
  }

  const { data, error } = await supabase.from(tabela).select('*').eq('id', parseInt(id))
.single();
  if (error || !data) return res.status(404).send('Item não encontrado');

  res.render('edit', { section: data, tabela });
});




// Upload de imagem (Supabase Storage)
app.post('/upload-image/:tabela/:campo/:id', upload.single('imagem'), async (req, res) => {
  const { tabela, campo, id } = req.params;
  const file = req.file;

  if (!tables.includes(tabela)) return res.status(400).send('Tabela inválida');
  if (!file) return res.status(400).send('Nenhum arquivo enviado');

  const ext = path.extname(file.originalname);
  const filePath = `${tabela}/${campo}_${id}${ext}`;

  // Lê o buffer da imagem local temporária
  const buffer = fs.readFileSync(file.path);

  // Upload para Supabase Storage
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
    upsert: true,
    contentType: file.mimetype,
  });

  // Remove arquivo local
  fs.unlinkSync(file.path);

  if (uploadError) {
    console.error(uploadError);
    return res.status(500).send('Erro ao subir imagem');
  }

  // URL pública da imagem
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  const imageUrl = publicUrlData.publicUrl;

  // Atualiza campo na tabela
  const { error: updateError } = await supabase
    .from(tabela)
    .update({ [campo]: imageUrl })
    .eq('id', parseInt(id));

  if (updateError) {
    console.error(updateError);
    return res.status(500).send('Erro ao salvar URL no banco');
  }

  res.redirect(`/edit/${tabela}/${id}`);
});



// Rota POST otimizada para texto puro
app.post('/edit/:tabela/:id', upload.none(), async (req, res) => {
  const { tabela, id } = req.params;

  if (!tables.includes(tabela)) return res.status(400).send('Tabela inválida');

  console.log('BODY recebido:', req.body); // <--- aqui

  const updateFields = {};
  for (const key in req.body) {
    if (key !== 'id' && typeof req.body[key] === 'string') {
      const raw = req.body[key].trim();
      if (raw && !raw.startsWith('<!DOCTYPE')) {
        const clean = raw.replace(/^"|"$/g, '');
        updateFields[key] = clean;
      }
    }
  }

  console.log(`Atualizando tabela ${tabela} onde id=${id}`, updateFields);

  const { error } = await supabase.from(tabela).update(updateFields).eq('id', parseInt(id));
  if (error) {
    console.error('Erro Supabase:', error);
    return res.status(500).send(`Erro ao atualizar dados: ${error.message}`);
  }

  res.redirect('/');
});










// Remover imagem (somente banco)
app.post('/delete-image/:tabela/:campo/:id', async (req, res) => {
  const { tabela, campo, id } = req.params;

  if (!tables.includes(tabela)) {
    return res.status(400).send('Tabela inválida');
  }

  const { error } = await supabase
    .from(tabela)
    .update({ [campo]: '' })
    .eq('id', parseInt(id));

  if (error) return res.status(500).send('Erro ao apagar imagem');

  res.type('text/plain').send(imageUrl);
});




const PORT = 4000
app.listen(PORT, () => console.log(`✅ Painel rodando em http://localhost:${PORT}`))


