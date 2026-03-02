const fs = require('fs');
const path = require('path');
const outPath = path.join(__dirname, 'phase2_review.html');

let html = fs.readFileSync(outPath, 'utf8');

// The image holder block to inject — placed BEFORE the closing of slide 9
// We anchor on the unique purple highlight block text that closes slide 9
const anchor = 'no polling needed. The';

// Image holder HTML to insert just before the closing purple highlight block of slide 9
const imageHolder = `
      <!-- ── ER Diagram Image Holder ── -->
      <div style="margin-top:20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <h3 style="font-size:.93rem;font-weight:700;color:var(--ink2)">ER Diagram</h3>
          <span class="badge badge-purple" style="font-size:.72rem">Paste your diagram below</span>
        </div>
        <div id="er-diagram-holder" style="
          min-height:260px;
          border:2.5px dashed rgba(88,86,214,0.35);
          border-radius:var(--r-lg);
          background:linear-gradient(135deg,rgba(88,86,214,0.04),rgba(175,82,222,0.03));
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:12px;position:relative;overflow:hidden;
          transition:border-color .25s,background .25s;
          cursor:pointer;
        "
        onclick="document.getElementById('er-img-input').click()"
        ondragover="event.preventDefault();this.style.borderColor='#5856D6';this.style.background='rgba(88,86,214,0.09)'"
        ondragleave="this.style.borderColor='rgba(88,86,214,0.35)';this.style.background='linear-gradient(135deg,rgba(88,86,214,0.04),rgba(175,82,222,0.03))'"
        ondrop="handleDrop(event)">
          <!-- Placeholder state -->
          <div id="er-placeholder" style="text-align:center;pointer-events:none">
            <div style="font-size:2.8rem;margin-bottom:10px;opacity:.35">&#128248;</div>
            <div style="font-size:.92rem;font-weight:700;color:var(--indigo);margin-bottom:4px">Drop your ER Diagram here</div>
            <div style="font-size:.8rem;color:var(--muted)">or click to browse &nbsp;&#8212;&nbsp; PNG, JPG, SVG, PDF</div>
          </div>
          <!-- Uploaded image (hidden until file added) -->
          <img id="er-img-preview" src="" alt="ER Diagram"
            style="display:none;max-width:100%;max-height:480px;border-radius:10px;box-shadow:var(--shadow-md)" />
          <!-- Hidden input -->
          <input id="er-img-input" type="file" accept="image/*" style="display:none"
            onchange="handleFileSelect(event)" />
        </div>
        <div style="margin-top:7px;font-size:.75rem;color:var(--muted);text-align:center">
          &#128161;&nbsp; Click the box above or drag &amp; drop your exported ER diagram image. It will display and scale automatically.
        </div>
      </div>

      <script>
        function handleFileSelect(e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function(ev) { showERImage(ev.target.result); };
          reader.readAsDataURL(file);
        }
        function handleDrop(e) {
          e.preventDefault();
          const holder = document.getElementById('er-diagram-holder');
          holder.style.borderColor = 'rgba(88,86,214,0.35)';
          holder.style.background = 'linear-gradient(135deg,rgba(88,86,214,0.04),rgba(175,82,222,0.03))';
          const file = e.dataTransfer.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function(ev) { showERImage(ev.target.result); };
          reader.readAsDataURL(file);
        }
        function showERImage(src) {
          document.getElementById('er-placeholder').style.display = 'none';
          const img = document.getElementById('er-img-preview');
          img.src = src;
          img.style.display = 'block';
          document.getElementById('er-diagram-holder').style.minHeight = 'auto';
          document.getElementById('er-diagram-holder').style.padding = '12px';
        }
      </script>
`;

if (!html.includes(anchor)) {
  console.error('ERROR: anchor text not found!');
  // Try alternate anchor
  const alt = 'admin_credentials';
  if (html.includes(alt)) {
    console.log('Using alternate anchor');
  }
  process.exit(1);
}

// Find the purple highlight block that closes slide 9 and insert BEFORE it
const purpleAnchor = 'Phase 2 Enhancement</h4>';
if (!html.includes(purpleAnchor)) {
  console.error('Purple anchor not found');
  process.exit(1);
}

// Insert imageHolder just before the parent div of the purple block
// The purple block starts with: <div class="highlight-block purple">
// Find its occurrence inside slide 9 context
const slideSegment = html.slice(html.indexOf('ER Overview'), html.indexOf('WHY SUPABASE'));
console.log('Segment length:', slideSegment.length);
console.log('Purple found in segment:', slideSegment.includes('highlight-block purple'));
