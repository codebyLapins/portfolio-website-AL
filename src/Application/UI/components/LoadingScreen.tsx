import React, { useCallback, useEffect, useState } from 'react';
import eventBus from '../EventBus';

type LoadingProps = {};

const LoadingScreen: React.FC<LoadingProps> = () => {
    const [progress, setProgress] = useState(0);
    const [toLoad, setToLoad] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [overlayOpacity, setLoadingOverlayOpacity] = useState(1);
    const [loadingTextOpacity, setLoadingTextOpacity] = useState(1);
    const [startPopupOpacity, setStartPopupOpacity] = useState(0);
    const [webGLErrorOpacity, setWebGLErrorOpacity] = useState(0);
    
    const [showInitializing, setShowInitializing] = useState(false);
    const [showLoadingResources, setShowLoadingResources] = useState(false);
    const [doneLoading, setDoneLoading] = useState(false);
    const [webGLError, setWebGLError] = useState(false);
    const [loadingMessages] = useState<string[]>([]);
    const [mobileWarning, setMobileWarning] = useState(window.innerWidth < 768);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const onResize = () => {
        setMobileWarning(window.innerWidth < 768);
    };

    window.addEventListener('resize', onResize);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            start();
        } else if (!detectWebGLContext()) {
            setWebGLError(true);
        } else {
            setTimeout(() => setShowInitializing(true), 500);
            setTimeout(() => setShowLoadingResources(true), 1500);
        }
    }, []);

    useEffect(() => {
        eventBus.on('loadedSource', (data) => {
            setProgress(data.progress);
            setToLoad(data.toLoad);
            setLoaded(data.loaded);
            
            loadingMessages.push(`[${currentTime}] Loading ${data.sourceName}... ${Math.round(data.progress * 100)}%`);
            if (loadingMessages.length > 12) {
                loadingMessages.shift();
            }
        });
    }, [currentTime]);

    useEffect(() => {
        if (progress >= 1 && !webGLError) {
            setDoneLoading(true);
            setTimeout(() => {
                setLoadingTextOpacity(0);
                setTimeout(() => {
                    setStartPopupOpacity(1);
                }, 800);
            }, 1200);
        }
    }, [progress]);

    useEffect(() => {
        if (webGLError) {
            setTimeout(() => {
                setWebGLErrorOpacity(1);
            }, 500);
        }
    }, [webGLError]);

    const start = useCallback(() => {
        setLoadingOverlayOpacity(0);
        eventBus.dispatch('loadingScreenDone', {});
        const ui = document.getElementById('ui');
        if (ui) {
            ui.style.pointerEvents = 'none';
        }
    }, []);

    const detectWebGLContext = () => {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl && gl instanceof WebGLRenderingContext;
    };

    const getProgressBar = () => {
        const filledBlocks = Math.floor(progress * 30);
        const emptyBlocks = 30 - filledBlocks;
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    };

    return (
        <div style={{...styles.overlay, opacity: overlayOpacity}}>
            {!webGLError && (
                <div style={{...styles.terminal, opacity: loadingTextOpacity}}>
                    <div style={styles.terminalHeader}>
                        <span style={styles.terminalTitle}>Portfolio Loader v2.0.1</span>
                        <span style={styles.terminalTime}>{currentTime}</span>
                    </div>
                    
                    <div style={styles.terminalBody}>
                        <div style={styles.ascii}>
                            <pre style={styles.asciiArt}>{`
    ██╗      █████╗ ██████╗ ██╗███╗   ██╗███████╗
    ██║     ██╔══██╗██╔══██╗██║████╗  ██║██╔════╝
    ██║     ███████║██████╔╝██║██╔██╗ ██║███████╗
    ██║     ██╔══██║██╔═══╝ ██║██║╚██╗██║╚════██║
    ███████╗██║  ██║██║     ██║██║ ╚████║███████║
    ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝
            `}</pre>
                        </div>

                        {showInitializing && (
                            <div style={styles.section}>
                                <p style={styles.greenText}>&gt; Initializing portfolio environment...</p>
                                <p style={styles.grayText}>&gt; WebGL: <span style={styles.okText}>OK</span></p>
                                <p style={styles.grayText}>&gt; Three.js: <span style={styles.okText}>LOADED</span></p>
                                <p style={styles.grayText}>&gt; System: <span style={styles.okText}>READY</span></p>
                            </div>
                        )}

                        {showLoadingResources && (
                            <div style={styles.section}>
                                <p style={styles.yellowText}>&gt; Loading resources... ({loaded}/{toLoad || '?'})</p>
                                
                                <div style={styles.progressContainer}>
                                    <span style={styles.grayText}>Progress: [</span>
                                    <span style={styles.progressBar}>{getProgressBar()}</span>
                                    <span style={styles.grayText}>] {Math.round(progress * 100)}%</span>
                                </div>

                                <div style={styles.logContainer}>
                                    {loadingMessages.map((message, index) => (
                                        <p key={index} style={styles.logMessage}>{message}</p>
                                    ))}
                                </div>

                                {doneLoading && (
                                    <div style={styles.section}>
                                        <p style={styles.greenText}>&gt; All resources loaded successfully!</p>
                                        <p style={styles.greenText}>&gt; Launching Arturs Lapiņš Portfolio...</p>
                                        <p style={styles.grayText}>&gt; Press ENTER to continue...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={styles.cursor}>
                            <span style={styles.prompt}>portfolio@system:~$ </span>
                            <span className="blinking-cursor">█</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Start popup */}
            <div style={{...styles.popupContainer, opacity: startPopupOpacity}}>
                <div style={styles.startPopup}>
                    <div style={styles.popupHeader}>
                        <span>:: PORTFOLIO READY ::</span>
                    </div>
                    
                    <div style={styles.popupBody}>
                        <p style={styles.greenText}>System initialized successfully</p>
                        <p style={styles.grayText}>Arturs Lapiņš - Developer Portfolio</p>
                        
                        {mobileWarning && (
                            <div style={styles.warning}>
                                <p style={styles.warningText}>⚠ WARNING: Best viewed on desktop</p>
                            </div>
                        )}
                        
                        <div style={styles.startButtonContainer}>
                            <button style={styles.startButton} onClick={start}>
                                [ ENTER PORTFOLIO ]
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* WebGL Error */}
            {webGLError && (
                <div style={{...styles.popupContainer, opacity: webGLErrorOpacity}}>
                    <div style={styles.errorPopup}>
                        <p style={styles.errorText}>ERROR: WebGL not supported</p>
                        <p style={styles.grayText}>Please enable WebGL or use a compatible browser</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    overlay: {
        backgroundColor: '#0c0c0c',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: '14px',
        lineHeight: 1.4,
        transition: 'opacity 0.3s ease-in-out',
    },
    
    terminal: {
        backgroundColor: '#1e1e1e',
        border: '2px solid #333',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '800px',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    
    terminalHeader: {
        backgroundColor: '#2d2d30',
        padding: '8px 16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#cccccc',
        fontSize: '12px',
    },
    
    terminalTitle: {
        fontWeight: 'bold',
    },
    
    terminalTime: {
        color: '#569cd6',
    },
    
    terminalBody: {
        flex: 1,
        padding: '20px',
        color: '#cccccc',
        overflow: 'auto',
    },
    
    ascii: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    
    asciiArt: {
        color: '#569cd6',
        fontSize: '10px',
        lineHeight: 1,
        margin: 0,
    },
    
    section: {
        marginBottom: '20px',
    },
    
    greenText: {
        color: '#4ec9b0',
    },
    
    yellowText: {
        color: '#dcdcaa',
    },
    
    grayText: {
        color: '#9cdcfe',
    },
    
    okText: {
        color: '#4ec9b0',
        fontWeight: 'bold',
    },
    
    progressContainer: {
        margin: '10px 0',
        fontFamily: 'monospace',
    },
    
    progressBar: {
        color: '#4ec9b0',
        letterSpacing: '1px',
    },
    
    logContainer: {
        maxHeight: '150px',
        overflow: 'auto',
        backgroundColor: '#262626',
        border: '1px solid #333',
        borderRadius: '4px',
        padding: '10px',
        margin: '10px 0',
    },
    
    logMessage: {
        margin: '2px 0',
        color: '#cccccc',
        fontSize: '12px',
    },
    
    cursor: {
        marginTop: 'auto',
        color: '#cccccc',
    },
    
    prompt: {
        color: '#4ec9b0',
    },
    
    popupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    
    startPopup: {
        backgroundColor: '#1e1e1e',
        border: '2px solid #4ec9b0',
        borderRadius: '8px',
        padding: '20px',
        minWidth: '400px',
        textAlign: 'center',
    },
    
    popupHeader: {
        color: '#4ec9b0',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    
    popupBody: {
        color: '#cccccc',
    },
    
    warning: {
        margin: '15px 0',
        padding: '10px',
        backgroundColor: '#332a00',
        border: '1px solid #665500',
        borderRadius: '4px',
    },
    
    warningText: {
        color: '#ffcc02',
        margin: 0,
    },
    
    startButtonContainer: {
        marginTop: '20px',
    },
    
    startButton: {
        backgroundColor: '#0e639c',
        color: '#ffffff',
        border: '2px solid #4ec9b0',
        padding: '12px 24px',
        fontSize: '14px',
        fontFamily: 'Consolas, "Courier New", monospace',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
    },
    
    errorPopup: {
        backgroundColor: '#1e1e1e',
        border: '2px solid #f44747',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
    },
    
    errorText: {
        color: '#f44747',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
};

export default LoadingScreen;