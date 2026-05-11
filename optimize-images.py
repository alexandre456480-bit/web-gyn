"""
WebGyn — Otimizador de imagens para performance mobile.
Comprime imagens WebP mantendo qualidade visual boa.
Foco nas imagens que mais impactam LCP e Speed Index.
"""

from PIL import Image
import os
import shutil

BASE = os.path.dirname(os.path.abspath(__file__))

# Imagens para otimizar: (caminho_relativo, qualidade_webp, max_width)
TARGETS = [
    # LCP image — a mais importante (297KB → ~80-120KB)
    ("hero/all.webp", 72, 800),
    # Showcase slides (carregam depois mas pesadas)
    ("hero/iphone.webp", 70, 600),
    ("hero/notebook.webp", 70, 800),
    ("hero/tablet.webp", 70, 600),
    # Hero background strip (cada uma ~40-70KB)
    ("hero/h1.webp", 60, 400),
    ("hero/h2.webp", 60, 400),
    ("hero/h3.webp", 60, 400),
    ("hero/h4.webp", 60, 400),
    ("hero/h5.webp", 60, 400),
    ("hero/h6.webp", 60, 400),
    ("hero/h7.webp", 60, 400),
    ("hero/h8.webp", 60, 400),
    # Projetos no carousel
    ("img/projetos/ativa.webp", 70, 400),
    ("img/projetos/dlu.webp", 70, 400),
    ("img/projetos/vidro.webp", 70, 400),
    ("img/projetos/hort.webp", 70, 400),
    # Logo
    ("logo.webp", 75, 200),
    ("logo2.webp", 75, 200),
    ("logo3.webp", 75, 64),
]

BACKUP_DIR = os.path.join(BASE, "_backup_imgs")

def optimize():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    total_saved = 0
    
    for rel_path, quality, max_w in TARGETS:
        full_path = os.path.join(BASE, rel_path)
        if not os.path.exists(full_path):
            print(f"[SKIP] Nao encontrado: {rel_path}")
            continue
        
        original_size = os.path.getsize(full_path)
        
        # Backup
        backup_path = os.path.join(BACKUP_DIR, rel_path.replace("/", "_"))
        if not os.path.exists(backup_path):
            shutil.copy2(full_path, backup_path)
        
        try:
            img = Image.open(full_path)
            w, h = img.size
            
            # Redimensiona se necessário
            if w > max_w:
                ratio = max_w / w
                new_h = int(h * ratio)
                img = img.resize((max_w, new_h), Image.LANCZOS)
            
            # Salva com compressão
            img.save(full_path, 'WEBP', quality=quality, method=6)
            
            new_size = os.path.getsize(full_path)
            saved = original_size - new_size
            total_saved += saved
            pct = (saved / original_size * 100) if original_size > 0 else 0
            
            print(f"[OK] {rel_path}: {original_size/1024:.0f}KB -> {new_size/1024:.0f}KB (-{pct:.0f}%)")
            
        except Exception as e:
            print(f"[ERR] Erro em {rel_path}: {e}")
    
    print(f"\n=== Total economizado: {total_saved/1024:.0f}KB ({total_saved/1024/1024:.1f}MB) ===")
    print(f"Backup salvo em: {BACKUP_DIR}")

if __name__ == "__main__":
    optimize()
