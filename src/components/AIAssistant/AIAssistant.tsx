import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import "./AIAssistant.css";


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const API_URL =
    "https://api.vanticompany.com.br/api/ia/chat";


/*
 * Coloque aqui o número oficial do WhatsApp
 * quando formos ativar o atendimento humano.
 *
 * Formato:
 * 5511999999999
 */

const WHATSAPP_NUMBER =
    "";


/* =====================================================
   TIPOS
===================================================== */

type Message = {

    id: number;

    role:
        | "assistant"
        | "user";

    text: string;

};


/* =====================================================
   COMPONENTE
===================================================== */

function AIAssistant() {


    /* =================================================
       ESTADOS
    ================================================= */

    const [
        open,
        setOpen,
    ] = useState(false);


    const [
        message,
        setMessage,
    ] = useState("");


    const [
        messages,
        setMessages,
    ] = useState<Message[]>([

        {
            id: 1,

            role:
                "assistant",

            text:
                "Olá! Como posso te ajudar com o Queridinho Supreme? 😊",

        },

    ]);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(false);


    /* =================================================
       REFERÊNCIAS
    ================================================= */

    const messagesContainerRef =
        useRef<HTMLDivElement>(null);


    const chatRef =
        useRef<HTMLDivElement>(null);


    const inputRef =
        useRef<HTMLInputElement>(null);


    const savedScrollYRef =
        useRef(0);


    const bodyStyleRef =
        useRef({

            position: "",
            top: "",
            width: "",
            overflow: "",
            overscrollBehavior: "",

        });


    /* =================================================
       ROLAR CONVERSA PARA O FINAL
    ================================================= */

    const scrollMessagesToBottom =
        (
            behavior:
                ScrollBehavior = "smooth"
        ) => {

            const container =
                messagesContainerRef.current;


            if (!container) {

                return;

            }


            container.scrollTo({

                top:
                    container.scrollHeight,

                behavior,

            });

        };


    /* =================================================
       BLOQUEAR A PÁGINA ATRÁS
    ================================================= */

    useEffect(() => {

        if (!open) {

            return;

        }


        /*
         * Guarda a posição atual da página.
         */

        savedScrollYRef.current =
            window.scrollY;


        /*
         * Guarda os estilos atuais.
         */

        bodyStyleRef.current = {

            position:
                document.body.style.position,

            top:
                document.body.style.top,

            width:
                document.body.style.width,

            overflow:
                document.body.style.overflow,

            overscrollBehavior:
                document.body.style.overscrollBehavior,

        };


        /*
         * Congela o body no lugar.
         */

        document.body.style.position =
            "fixed";

        document.body.style.top =
            `-${savedScrollYRef.current}px`;

        document.body.style.width =
            "100%";

        document.body.style.overflow =
            "hidden";

        document.body.style.overscrollBehavior =
            "none";


        /*
         * Evita que a própria página
         * tente sofrer overscroll.
         */

        document.documentElement.style.overscrollBehavior =
            "none";


        /*
         * iPhone/Safari: quando o teclado abre, o visual viewport
         * fica menor que o viewport normal. Se o chat continuar
         * usando apenas 100dvh, o Safari pode deslocar o componente
         * para tentar revelar o input.
         *
         * Aqui fazemos o chat acompanhar exatamente o visual viewport.
         */

        const chat =
            chatRef.current;


        const visualViewport =
            window.visualViewport;


        const updateVisualViewport =
            () => {

                if (!chat) {

                    return;

                }


                if (visualViewport) {

                    chat.style.setProperty(
                        "--ai-viewport-top",
                        `${visualViewport.offsetTop}px`
                    );

                    chat.style.setProperty(
                        "--ai-viewport-height",
                        `${visualViewport.height}px`
                    );

                } else {

                    chat.style.setProperty(
                        "--ai-viewport-top",
                        "0px"
                    );

                    chat.style.setProperty(
                        "--ai-viewport-height",
                        "100dvh"
                    );

                }

            };


        updateVisualViewport();


        visualViewport?.addEventListener(
            "resize",
            updateVisualViewport
        );


        visualViewport?.addEventListener(
            "scroll",
            updateVisualViewport
        );


        return () => {

            /*
             * Restaura os estilos originais.
             */

            document.body.style.position =
                bodyStyleRef.current.position;

            document.body.style.top =
                bodyStyleRef.current.top;

            document.body.style.width =
                bodyStyleRef.current.width;

            document.body.style.overflow =
                bodyStyleRef.current.overflow;

            document.body.style.overscrollBehavior =
                bodyStyleRef.current.overscrollBehavior;


            document.documentElement.style.overscrollBehavior =
                "";


            visualViewport?.removeEventListener(
                "resize",
                updateVisualViewport
            );


            visualViewport?.removeEventListener(
                "scroll",
                updateVisualViewport
            );


            chat?.style.removeProperty(
                "--ai-viewport-top"
            );


            chat?.style.removeProperty(
                "--ai-viewport-height"
            );


            /*
             * Retorna exatamente para o ponto
             * onde a IA foi aberta.
             */

            window.scrollTo({

                top:
                    savedScrollYRef.current,

                behavior:
                    "instant" as ScrollBehavior,

            });

        };

    }, [
        open,
    ]);


    /* =================================================
       CONVERSA AO ABRIR
    ================================================= */

    useEffect(() => {

        if (!open) {

            return;

        }


        /*
         * Aguarda o navegador renderizar a IA
         * antes de posicionar a conversa.
         */

        requestAnimationFrame(() => {

            scrollMessagesToBottom(
                "instant" as ScrollBehavior
            );

        });

    }, [
        open,
    ]);


    /* =================================================
       NOVAS MENSAGENS
    ================================================= */

    useEffect(() => {

        if (!open) {

            return;

        }


        requestAnimationFrame(() => {

            scrollMessagesToBottom(
                "smooth"
            );

        });

    }, [
        messages,
        loading,
        open,
    ]);


    /* =================================================
       INPUT RECEBE FOCO
    ================================================= */

    const handleInputFocus =
        () => {

            /*
             * Não usamos scrollIntoView.
             *
             * Não usamos visualViewport.
             *
             * Não movemos o body.
             *
             * Apenas garantimos que a conversa esteja
             * no final antes do teclado aparecer.
             */

            scrollMessagesToBottom(
                "instant" as ScrollBehavior
            );

        };


    /* =================================================
       ENVIAR MENSAGEM
    ================================================= */

    const sendMessage =
        async (
            event?: FormEvent
        ) => {

            event?.preventDefault();


            const text =
                message.trim();


            if (
                !text ||
                loading
            ) {

                return;

            }


            setMessage("");

            setError(false);


            /* =========================================
               MENSAGEM DO USUÁRIO
            ========================================= */

            const userMessage: Message = {

                id:
                    Date.now(),

                role:
                    "user",

                text,

            };


            const updatedMessages =
                [
                    ...messages,
                    userMessage,
                ];


            setMessages(
                updatedMessages
            );


            setLoading(
                true
            );


            /*
             * Leva a conversa até a nova mensagem.
             */

            requestAnimationFrame(() => {

                scrollMessagesToBottom(
                    "smooth"
                );

            });


            try {

                /* =====================================
                   CHAMADA DA API
                ===================================== */

                const response =
                    await fetch(
                        API_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                            },

                            body:
                                JSON.stringify({

                                    mensagem:
                                        text,

                                    historico:
                                        updatedMessages
                                            .slice(-12)
                                            .map(
                                                (
                                                    item
                                                ) => ({

                                                    role:
                                                        item.role,

                                                    text:
                                                        item.text,

                                                })
                                            ),

                                }),

                        }
                    );


                /* =====================================
                   VALIDAR RESPOSTA
                ===================================== */

                if (
                    !response.ok
                ) {

                    throw new Error(
                        "Erro na resposta da API."
                    );

                }


                const data =
                    await response.json();


                if (
                    !data?.resposta
                ) {

                    throw new Error(
                        "Resposta inválida da IA."
                    );

                }


                /* =====================================
                   RESPOSTA DA IA
                ===================================== */

                const assistantMessage: Message = {

                    id:
                        Date.now() + 1,

                    role:
                        "assistant",

                    text:
                        String(
                            data.resposta
                        ),

                };


                setMessages(
                    (
                        currentMessages
                    ) => [

                        ...currentMessages,

                        assistantMessage,

                    ]
                );


            } catch (
                requestError
            ) {

                console.error(
                    "Erro ao conversar com a IA:",
                    requestError
                );


                setError(
                    true
                );


                setMessages(
                    (
                        currentMessages
                    ) => [

                        ...currentMessages,

                        {

                            id:
                                Date.now() + 1,

                            role:
                                "assistant",

                            text:
                                "No momento não consegui responder. Você pode tentar novamente ou falar diretamente com a Vanti pelo WhatsApp.",

                        },

                    ]
                );


            } finally {

                setLoading(
                    false
                );

            }

        };


    /* =================================================
       ENTER
    ================================================= */

    const handleKeyDown =
        (
            event:
                ReactKeyboardEvent<HTMLInputElement>
        ) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        };


    /* =================================================
       WHATSAPP
    ================================================= */

    const openWhatsApp =
        () => {

            if (
                !WHATSAPP_NUMBER
            ) {

                return;

            }


            const url =
                `https://wa.me/${WHATSAPP_NUMBER}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        };


    /* =================================================
       FECHAR IA
    ================================================= */

    const closeAssistant =
        () => {

            inputRef.current?.blur();


            setOpen(
                false
            );

        };


    /* =================================================
       RENDER
    ================================================= */

    return (

        <>

            {/* =================================================
                JANELA
            ================================================= */}

            <div

                ref={
                    chatRef
                }

                className={`
                    ai-chat
                    ${open ? "ai-chat-open" : ""}
                `}

                aria-hidden={
                    !open
                }

            >

                {/* =============================================
                    CABEÇALHO
                ============================================= */}

                <div className="ai-chat-header">

                    <div className="ai-chat-header-info">

                        <div className="ai-chat-avatar">

                            ✨

                        </div>


                        <div>

                            <strong>
                                Assistente Vanti
                            </strong>


                            <span>

                                <i />

                                Online

                            </span>

                        </div>

                    </div>


                    <button

                        type="button"

                        className="ai-chat-close"

                        onClick={
                            closeAssistant
                        }

                        aria-label="Fechar assistente"

                    >

                        ×

                    </button>

                </div>


                {/* =============================================
                    MENSAGENS
                ============================================= */}

                <div

                    ref={
                        messagesContainerRef
                    }

                    className="ai-chat-messages"

                >

                    {messages.map(
                        (
                            item
                        ) => (

                            <div

                                key={
                                    item.id
                                }

                                className={`
                                    ai-message
                                    ${item.role === "user"
                                        ? "ai-message-user"
                                        : "ai-message-assistant"
                                    }
                                `}

                            >

                                <div className="ai-message-bubble">

                                    {item.text}

                                </div>

                            </div>

                        )
                    )}


                    {/* =========================================
                        LOADING
                    ========================================= */}

                    {loading && (

                        <div className="ai-message ai-message-assistant">

                            <div className="ai-message-bubble ai-loading">

                                <span />
                                <span />
                                <span />

                            </div>

                        </div>

                    )}

                </div>


                {/* =============================================
                    ERRO
                ============================================= */}

                {error && WHATSAPP_NUMBER && (

                    <button

                        type="button"

                        className="ai-whatsapp-button"

                        onClick={
                            openWhatsApp
                        }

                    >

                        💬 Falar com a Vanti

                    </button>

                )}


                {/* =============================================
                    INPUT
                ============================================= */}

                <form

                    className="ai-chat-form"

                    onSubmit={
                        sendMessage
                    }

                >

                    <input

                        ref={
                            inputRef
                        }

                        type="text"

                        value={
                            message
                        }

                        onChange={(
                            event
                        ) =>
                            setMessage(
                                event.target.value
                            )
                        }

                        onFocus={
                            handleInputFocus
                        }

                        onKeyDown={
                            handleKeyDown
                        }

                        placeholder="Digite sua dúvida..."

                        autoComplete="off"

                        disabled={
                            loading
                        }

                    />


                    <button

                        type="submit"

                        className="ai-send-button"

                        disabled={
                            !message.trim() ||
                            loading
                        }

                        aria-label="Enviar mensagem"

                    >

                        ↑

                    </button>

                </form>

            </div>


            {/* =================================================
                BOTÃO FLUTUANTE
            ================================================= */}

            <button

                type="button"

                className={`
                    ai-floating-button
                    ${open ? "ai-floating-button-open" : ""}
                `}

                onClick={() =>
                    setOpen(
                        (
                            current
                        ) => !current
                    )
                }

                aria-label={
                    open
                        ? "Fechar assistente"
                        : "Abrir assistente"
                }

                aria-expanded={
                    open
                }

            >

                {open
                    ? "×"
                    : "✦"
                }

            </button>

        </>

    );

}


export default AIAssistant;