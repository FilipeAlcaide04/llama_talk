 const mensagensDiv = document.getElementById('mensagens');
        const btn = document.getElementById('startStop');
        const buttonIcon = document.getElementById('buttonIcon');
        const buttonText = document.getElementById('buttonText');
        const voiceVisualizer = document.getElementById('voiceVisualizer');
        const connectionStatus = document.getElementById('connectionStatus');
        
        let recognition;
        let ouvindo = false;
        let firstMessage = true;

        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        }

        if (recognition) {
            // recognition.lang = 'pt-PT';
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = function() {
                console.log('Llama Talk link established');
                connectionStatus.textContent = 'Processing...';
            };

            recognition.onresult = function(event) {
                const texto = event.results[0][0].transcript;
                adicionarMensagem("user", "Llama Talk Input", texto);
                enviarParaIA(texto);
            };

            recognition.onerror = function(event) {
                console.error("Error in Llama Talk:", event.error);
                adicionarMensagem("error", "System Error", "Llama Talk connection failure. Restarting protocol...");
                pararGravacao();
                connectionStatus.textContent = 'Connection Error';
                setTimeout(() => {
                    connectionStatus.textContent = 'Connected';
                }, 3000);
            };

            recognition.onend = function() {
                pararGravacao();
                connectionStatus.textContent = 'Connected';
            };
        } else {
            alert("Llama Talk not supported by this browser.");
            btn.disabled = true;
            connectionStatus.textContent = 'Incompatible';
        }

        btn.onclick = () => {
            if (ouvindo) {
                recognition.stop();
            } else {
                iniciarGravacao();
            }
        };

        function iniciarGravacao() {
            if (firstMessage) {
                mensagensDiv.innerHTML = '';
                firstMessage = false;
            }
            
            recognition.start();
            ouvindo = true;
            btn.classList.add('recording');
            voiceVisualizer.classList.add('recording');
            buttonIcon.textContent = "⏹️";
            buttonText.textContent = "Deactivate Neural Link";
            connectionStatus.textContent = 'Listening...';
        }

        function pararGravacao() {
            ouvindo = false;
            btn.classList.remove('recording');
            voiceVisualizer.classList.remove('recording');
            buttonIcon.textContent = "🎙️";
            buttonText.textContent = "Ativar Neural Link";
            connectionStatus.textContent = 'Conectado';
        }

        function adicionarMensagem(type, remetente, texto) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            const senderDiv = document.createElement('div');
            senderDiv.className = 'message-sender';
            senderDiv.textContent = remetente;
            
            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.textContent = texto;
            
            messageDiv.appendChild(senderDiv);
            messageDiv.appendChild(textDiv);
            mensagensDiv.appendChild(messageDiv);
            mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
        }

        function falarTexto(texto) {
            const utterance = new SpeechSynthesisUtterance(texto);
            // utterance.lang = 'pt-PT';'en-US'
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }

        async function enviarParaIA(texto) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai';
            loadingDiv.innerHTML = `
                <div class="message-sender">Llama Talk</div>
                <div class="message-text">
                    Processing information...
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            mensagensDiv.appendChild(loadingDiv);
            mensagensDiv.scrollTop = mensagensDiv.scrollHeight;

            connectionStatus.textContent = 'Processing Llama Talk...';

            try {
                const res = await fetch("/perguntar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mensagem: texto })
                });
                
                const data = await res.json();
                
                // Remove loading message
                mensagensDiv.removeChild(loadingDiv);
                
                adicionarMensagem("ai", "Llama Talk", data.resposta);
                falarTexto(data.resposta);
                connectionStatus.textContent = 'Connected';
            } catch (error) {
                console.error("Error in Llama Talk communication:", error);
                
                // Remove loading message
                mensagensDiv.removeChild(loadingDiv);
                
                adicionarMensagem("error", "System Critical", "Critical system failure. Restarting protocol...");
                connectionStatus.textContent = 'System Failure';

                setTimeout(() => {
                    connectionStatus.textContent = 'Connected';
                }, 5000);
            }
        }

        // Add some ambient effects
        setInterval(() => {
            if (!ouvindo && Math.random() < 0.1) {
                const statusDots = document.querySelectorAll('.status-dot');
                statusDots.forEach(dot => {
                    dot.style.animation = 'none';
                    setTimeout(() => {
                        dot.style.animation = 'blink 2s ease-in-out infinite';
                    }, 100);
                });
            }
        }, 3000);