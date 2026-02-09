(function() {
  'use strict';

  const CONFIG = window.APP_CONFIG || {
    maxSize: 50 * 1024 * 1024,
    maxFiles: 20,
    inputFormats: ['svg'],
    outputFormat: 'png',
    texts: {},
    errors: {}
  };

  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const dropMessage = document.getElementById('dropMessage');
  const filesScroll = document.getElementById('filesScroll');
  const filesContainer = document.getElementById('filesContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const clearBtn = document.getElementById('clearBtn');
  const convertBtn = document.getElementById('convertBtn');
  const convertCounter = document.getElementById('convertCounter');
  const downloadAllBtn = document.getElementById('downloadAllBtn');
  const downloadCounter = document.getElementById('downloadCounter');
  const fileCardTemplate = document.getElementById('fileCardTemplate');

  let files = [];
  let isConverting = false;
  let isDownloading = false;

  let conversionAborted = false;
  let currentConvertingId = null;
  const shimmeredElements = new Set();

  const DEFAULT_SCALE = 2;
  const THUMB_SIZE = 200;

  function shimmerHint(element) {
    if (element) window.SharedUtils.shimmerHint(element, shimmeredElements);
  }

  /**
   * Add width/height from viewBox if missing
   */
  function fixSvgDimensions(svgContent) {
    return svgContent.replace(/<svg([^>]*)>/i, function(match, attrs) {
      const hasWidth = /\swidth\s*=/i.test(attrs);
      const hasHeight = /\sheight\s*=/i.test(attrs);

      if (!hasWidth || !hasHeight) {
        const viewBoxMatch = attrs.match(/viewBox\s*=\s*["']([^"']+)["']/i);
        if (viewBoxMatch) {
          const parts = viewBoxMatch[1].trim().split(/\s+/);
          if (parts.length === 4) {
            const vbWidth = parts[2];
            const vbHeight = parts[3];
            let newAttrs = attrs;
            if (!hasWidth) newAttrs += ` width="${vbWidth}"`;
            if (!hasHeight) newAttrs += ` height="${vbHeight}"`;
            return '<svg' + newAttrs + '>';
          }
        }
      }
      return match;
    });
  }

  /**
   * Parse SVG to extract dimensions
   */
  function parseSvgDimensions(svgText) {
    const widthMatch = svgText.match(/\bwidth=["']?(\d+(?:\.\d+)?)(px|em|%)?["']?/i);
    const heightMatch = svgText.match(/\bheight=["']?(\d+(?:\.\d+)?)(px|em|%)?["']?/i);

    let width = widthMatch ? parseFloat(widthMatch[1]) : null;
    let height = heightMatch ? parseFloat(heightMatch[1]) : null;

    if (!width || !height || (widthMatch && widthMatch[2] === '%') || (heightMatch && heightMatch[2] === '%')) {
      const viewBoxMatch = svgText.match(/viewBox=["']?\s*[\d.+-]+[\s,]+[\d.+-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
      if (viewBoxMatch) {
        const vbWidth = parseFloat(viewBoxMatch[1]);
        const vbHeight = parseFloat(viewBoxMatch[2]);
        if (!width || (widthMatch && widthMatch[2] === '%')) width = vbWidth;
        if (!height || (heightMatch && heightMatch[2] === '%')) height = vbHeight;
      }
    }

    if (!width) width = 300;
    if (!height) height = 150;

    return { width, height };
  }

  /**
   * Load SVG as Image element
   */
  function loadSvgAsImage(svgText, targetWidth, targetHeight) {
    return new Promise((resolve, reject) => {
      // Ensure xmlns is present
      if (!svgText.includes('xmlns=')) {
        svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // Set dimensions
      svgText = svgText.replace(/<svg([^>]*)>/, (match, attrs) => {
        attrs = attrs.replace(/\bwidth=["'][^"']*["']/gi, '');
        attrs = attrs.replace(/\bheight=["'][^"']*["']/gi, '');
        return `<svg${attrs} width="${targetWidth}" height="${targetHeight}">`;
      });

      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      img.src = url;
    });
  }

  /**
   * Convert SVG to PNG
   */
  async function convertSvgToPng(svgText, scale = DEFAULT_SCALE) {
    const { width, height } = parseSvgDimensions(svgText);
    const targetWidth = Math.round(width * scale);
    const targetHeight = Math.round(height * scale);

    const img = await loadSvgAsImage(svgText, targetWidth, targetHeight);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG'));
        }
      }, 'image/png');
    });
  }

  /**
   * Generate thumbnail from SVG
   */
  async function generateThumbnail(svgText) {
    const { width, height } = parseSvgDimensions(svgText);

    let thumbWidth, thumbHeight;
    if (width > height) {
      thumbWidth = THUMB_SIZE;
      thumbHeight = Math.round(height * (THUMB_SIZE / width));
    } else {
      thumbHeight = THUMB_SIZE;
      thumbWidth = Math.round(width * (THUMB_SIZE / height));
    }

    const img = await loadSvgAsImage(svgText, thumbWidth, thumbHeight);

    const canvas = document.createElement('canvas');
    canvas.width = thumbWidth;
    canvas.height = thumbHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            originalWidth: width,
            originalHeight: height
          });
        } else {
          reject(new Error('Failed to create thumbnail'));
        }
      }, 'image/png');
    });
  }

  async function addFiles(newFiles) {
    const remaining = CONFIG.maxFiles - files.length;
    if (remaining <= 0) return;

    const filesToAdd = Array.from(newFiles).slice(0, remaining);

    for (const file of filesToAdd) {
      let ext = getFileExtension(file.name);

      const realFormat = await detectFormat(file);
      if (realFormat && CONFIG.inputFormats.includes(realFormat)) {
        ext = realFormat;
      }

      if (!CONFIG.inputFormats.includes(ext)) {
        continue;
      }

      if (file.size > CONFIG.maxSize) {
        continue;
      }

      const baseName = file.name.replace(/\.[^.]+$/, '');

      const fileData = {
        id: generateId(),
        file: file,
        name: baseName,
        inputFormat: ext.toUpperCase(),
        status: 'pending',
        progress: 0,
        localThumbUrl: null,
        imageWidth: null,
        imageHeight: null,
        outputFormat: CONFIG.outputFormat,
        outputBlob: null,
        outputUrl: null,
        errorMessage: null,
        downloaded: false
      };

      files.push(fileData);
      renderFileCard(fileData);

      // Generate thumbnail
      try {
        const svgText = fixSvgDimensions(await file.text());
        const thumb = await generateThumbnail(svgText);
        fileData.localThumbUrl = thumb.url;
        fileData.imageWidth = thumb.originalWidth;
        fileData.imageHeight = thumb.originalHeight;

        const card = filesContainer.querySelector(`[data-id="${fileData.id}"]`);
        if (card) {
          const img = card.querySelector('.file__image');
          if (img) {
            img.src = thumb.url;
            img.onload = () => img.classList.remove('file__image_hidden');
          }
        }
      } catch (e) {
        console.error('Thumbnail error:', e);
      }
    }

    updateUI();
    scrollToEnd();
  }

  function removeFile(id) {
    const index = files.findIndex(f => f.id === id);
    if (index === -1) return;

    const fileData = files[index];

    if (currentConvertingId === id) {
      currentConvertingId = null;
    }

    if (fileData.localThumbUrl) {
      URL.revokeObjectURL(fileData.localThumbUrl);
    }
    if (fileData.outputUrl) {
      URL.revokeObjectURL(fileData.outputUrl);
    }

    files.splice(index, 1);

    const card = filesContainer.querySelector(`[data-id="${id}"]`);
    if (card) {
      card.remove();
    }

    updateUI();
  }

  function clearAll() {
    conversionAborted = true;
    currentConvertingId = null;
    isConverting = false;

    files.forEach(f => {
      if (f.localThumbUrl) URL.revokeObjectURL(f.localThumbUrl);
      if (f.outputUrl) URL.revokeObjectURL(f.outputUrl);
    });

    files = [];
    filesContainer.innerHTML = '';
    updateUI();
  }

  async function convertAll() {
    if (isConverting) return;

    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    isConverting = true;
    conversionAborted = false;
    updateUI();

    for (const fileData of pendingFiles) {
      if (conversionAborted) break;
      if (fileData.status !== 'pending') continue;
      if (!files.find(f => f.id === fileData.id)) continue;

      currentConvertingId = fileData.id;

      try {
        fileData.status = 'converting';
        updateFileCard(fileData);

        if (conversionAborted || !files.find(f => f.id === fileData.id)) {
          currentConvertingId = null;
          continue;
        }

        const svgText = fixSvgDimensions(await fileData.file.text());
        const outputBlob = await convertSvgToPng(svgText);

        if (conversionAborted || !files.find(f => f.id === fileData.id)) {
          currentConvertingId = null;
          continue;
        }

        fileData.status = 'done';
        fileData.outputBlob = outputBlob;
        fileData.outputUrl = URL.createObjectURL(outputBlob);

      } catch (error) {
        console.error('Conversion error:', error);
        if (!conversionAborted && files.find(f => f.id === fileData.id)) {
          fileData.status = 'error';
          fileData.errorMessage = error.message || 'Conversion failed';
        }
      }

      currentConvertingId = null;
      if (files.find(f => f.id === fileData.id)) {
        updateFileCard(fileData);
      }
    }

    currentConvertingId = null;
    isConverting = false;
    conversionAborted = false;
    updateUI();
  }

  function downloadFile(fileData) {
    if (!fileData.outputUrl || !fileData.outputBlob) return;

    fileData.downloaded = true;

    const filename = `${fileData.name}.${fileData.outputFormat}`;
    const a = document.createElement('a');
    a.href = fileData.outputUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    updateFileCard(fileData);
    updateUI();
  }

  function downloadAll() {
    const doneFiles = files.filter(f => f.status === 'done' && f.outputBlob && !f.downloaded);
    if (doneFiles.length === 0 || isDownloading) return;

    isDownloading = true;
    convertBtn.disabled = true;

    let completed = 0;
    const total = doneFiles.length;

    doneFiles.forEach((fileData, index) => {
      setTimeout(() => {
        downloadFile(fileData);
        completed++;
        if (completed >= total) {
          isDownloading = false;
          updateUI();
        }
      }, index * 100);
    });
  }

  function renderFileCard(fileData) {
    const template = fileCardTemplate.content.cloneNode(true);
    const card = template.querySelector('.file');

    card.dataset.id = fileData.id;
    card.querySelector('.file__title').textContent = truncateName(fileData.name + '.' + fileData.inputFormat.toLowerCase());

    const img = card.querySelector('.file__image');
    if (fileData.localThumbUrl) {
      img.src = fileData.localThumbUrl;
      img.onload = () => img.classList.remove('file__image_hidden');
      img.onerror = () => {
        fileData.status = 'error';
        fileData.errorMessage = 'The source image could not be decoded';
        updateFileCard(fileData);
      };
    }

    const pendingFormatText = card.querySelector('.file__state_pending .file__state-text_format');
    if (pendingFormatText) {
      pendingFormatText.textContent = fileData.inputFormat;
    }

    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFile(fileData.id);
    });

    const downloadBtn = card.querySelector('.file-button');
    downloadBtn.addEventListener('click', () => {
      const currentFile = files.find(f => f.id === fileData.id);
      if (currentFile && currentFile.status === 'done') {
        downloadFile(currentFile);
      }
    });

    filesContainer.appendChild(card);
    updateScrollButtons();
  }

  function updateFileCard(fileData) {
    const card = filesContainer.querySelector(`[data-id="${fileData.id}"]`);
    if (!card) return;

    const fileButton = card.querySelector('.file-button');
    const progressBar = card.querySelector('.file-button__progress');
    const buttonText = card.querySelector('.file-button__text');

    const statePending = card.querySelector('.file__state_pending');
    const stateConverting = card.querySelector('.file__state_converting');
    const stateError = card.querySelector('.file__state_error');
    const stateDone = card.querySelector('.file__state_done');

    [statePending, stateConverting, stateError, stateDone].forEach(s => {
      if (s) s.classList.remove('file__state_visible');
    });

    switch (fileData.status) {
      case 'pending':
        statePending.classList.add('file__state_visible');
        fileButton.classList.add('file-button_hidden');
        fileButton.disabled = true;
        progressBar.style.width = '0%';
        buttonText.textContent = '';
        break;

      case 'converting':
        stateConverting.classList.add('file__state_visible');
        fileButton.classList.remove('file-button_hidden');
        fileButton.disabled = true;
        progressBar.classList.remove('file-button__progress_pause', 'file-button__progress_hidden');
        void progressBar.offsetHeight;
        progressBar.style.width = '100%';
        buttonText.textContent = '';
        break;

      case 'done':
        stateDone.classList.add('file__state_visible');
        const doneFormatText = stateDone.querySelector('.file__state-text_format');
        if (doneFormatText) {
          doneFormatText.textContent = fileData.outputFormat.toUpperCase();
        }
        progressBar.classList.add('file-button__progress_hidden');
        if (fileData.downloaded) {
          fileButton.classList.add('file-button_hidden');
          fileButton.disabled = true;
          buttonText.textContent = '';
        } else {
          fileButton.classList.remove('file-button_hidden');
          fileButton.disabled = false;
          buttonText.textContent = CONFIG.texts.save || 'SAVE';
        }
        break;

      case 'error':
        stateError.classList.add('file__state_visible');
        const detail = stateError.querySelector('.file__state-detail');
        if (detail) detail.textContent = classifyError(fileData.errorMessage);
        fileButton.classList.add('file-button_hidden');
        fileButton.disabled = true;
        progressBar.style.width = '0%';
        buttonText.textContent = '';
        updateUI();
        break;
    }
  }

  function updateUI() {
    const hasFiles = files.length > 0;
    const pendingCount = files.filter(f => f.status === 'pending').length;
    const downloadableCount = files.filter(f => f.status === 'done' && !f.downloaded).length;

    clearBtn.disabled = !hasFiles;

    convertBtn.disabled = pendingCount === 0 || isConverting;
    if (pendingCount > 0) {
      convertCounter.textContent = pendingCount;
      convertCounter.style.display = '';
      if (!convertBtn.disabled) {
        setTimeout(() => { if (!convertBtn.disabled) shimmerHint(convertBtn); }, 500);
      }
    } else {
      convertCounter.style.display = 'none';
    }

    if (downloadAllBtn) {
      downloadAllBtn.disabled = downloadableCount === 0 || isDownloading;
      if (downloadableCount > 0) {
        downloadCounter.textContent = downloadableCount;
        downloadCounter.style.display = '';
      } else {
        downloadCounter.style.display = 'none';
      }
    }

    dropMessage.classList.toggle('drop-caption_hidden', hasFiles);
    updateScrollButtons();
  }

  function updateScrollButtons() {
    if (!filesScroll) return;

    const { scrollLeft, scrollWidth, clientWidth } = filesScroll;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;

    prevBtn.disabled = !canScrollLeft;
    nextBtn.disabled = !canScrollRight;
  }

  function scrollToEnd() {
    if (!filesScroll) return;
    setTimeout(() => {
      filesScroll.scrollTo({
        left: filesScroll.scrollWidth,
        behavior: 'smooth'
      });
    }, 100);
  }

  function scrollBy(amount) {
    if (!filesScroll) return;

    const maxScroll = filesScroll.scrollWidth - filesScroll.clientWidth;

    if (amount < 0 && filesScroll.scrollLeft < Math.abs(amount)) {
      filesScroll.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (amount > 0 && filesScroll.scrollLeft + amount > maxScroll - 10) {
      filesScroll.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }

    filesScroll.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  }

  function handleFileSelect(e) {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
      e.target.value = '';
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('files__list-outer_dragover');
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('files__list-outer_dragover');
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('files__list-outer_dragover');

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }

  function classifyError(msg) {
    if (!msg) return CONFIG.errors.processing || '';
    const m = msg.toLowerCase();
    if (m.includes('could not be decoded') || m.includes('cannot decode') || m.includes('size of offscreencanvas is zero') || m.includes('readback') || m.includes('createimagebitmap') || m.includes('encoding') || m.includes('invalid image') || m.includes('not a valid') || m.includes('invalid state')) return CONFIG.errors.corrupt || '';
    if (m.includes('memory access') || m.includes('out of memory') || m.includes('abort(') || m.includes('exit(1)') || m.includes('unreachable') || m.includes('wasm worker crashed')) return CONFIG.errors.tooLarge || '';
    if (m.includes('failed to fetch') || m.includes('dynamically imported module') || m.includes('load failed')) return CONFIG.errors.loading || '';
    if (m.includes('max buffer length') || m.includes('non-whitespace before first tag') || m.includes('invalid svg')) return CONFIG.errors.svg || '';
    return CONFIG.errors.processing || '';
  }

  function init() {
    if (typeof OffscreenCanvas === 'undefined') {
      const msg = dropMessage.querySelector('.drop-caption__text');
      if (msg) {
        msg.textContent = (CONFIG.errors.browserUnsupported || 'Please update your browser').toUpperCase();
        msg.style.color = '#e74c3c';
      }
      fileInput.disabled = true;
      fileInput.parentElement.classList.add('button_disabled');
      return;
    }

    fileInput.addEventListener('change', handleFileSelect);

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => e.preventDefault());

    clearBtn.addEventListener('click', clearAll);
    convertBtn.addEventListener('click', convertAll);
    if (downloadAllBtn) {
      downloadAllBtn.addEventListener('click', downloadAll);
    }

    prevBtn.addEventListener('click', () => scrollBy(-300));
    nextBtn.addEventListener('click', () => scrollBy(300));
    filesScroll.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    window.addEventListener('beforeunload', () => {
      files.forEach(f => {
        if (f.localThumbUrl) URL.revokeObjectURL(f.localThumbUrl);
        if (f.outputUrl) URL.revokeObjectURL(f.outputUrl);
      });
    });

    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
