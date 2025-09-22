import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import UIEventBus from '../EventBus';

const HELP_TEXT = 'Click anywhere to begin';

type HelpPromptProps = {};

const HelpPrompt: React.FC<HelpPromptProps> = () => {
    const [helpText, setHelpText] = useState('');
    const [visible, setVisible] = useState(true);
    const [showCursor, setShowCursor] = useState(true);
    const visRef = useRef(visible);

    const typeHelpText = (i: number, curText: string) => {
        if (i < HELP_TEXT.length && visRef.current) {
            setTimeout(() => {
                window.postMessage(
                    { type: 'keydown', key: `_AUTO_${HELP_TEXT[i]}` },
                    '*'
                );

                setHelpText(curText + HELP_TEXT[i]);
                typeHelpText(i + 1, curText + HELP_TEXT[i]);
            }, Math.random() * 120 + 50);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            typeHelpText(0, '');
        }, 500);

        // Cursor blinking
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 600);

        const handleClick = () => {
            setVisible(false);
        };

        document.addEventListener('mousedown', handleClick);
        UIEventBus.on('enterMonitor', () => {
            setVisible(false);
        });

        return () => {
            clearInterval(cursorInterval);
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    useEffect(() => {
        if (visible === false) {
            window.postMessage({ type: 'keydown', key: `_AUTO_` }, '*');
        }
        visRef.current = visible;
    }, [visible]);

    return helpText.length > 0 ? (
        <motion.div
            variants={vars}
            animate={visible ? 'visible' : 'hide'}
            style={styles.container}
        >
            <div style={styles.terminal}>
                <div style={styles.promptLine}>
                    <span style={styles.prompt}>C:\&gt; </span>
                    <span style={styles.command}>{helpText}</span>
                    <span 
                        style={{
                            ...styles.cursor,
                            opacity: showCursor ? 1 : 0
                        }}
                    >
                        █
                    </span>
                </div>
            </div>
        </motion.div>
    ) : null;
};

const vars = {
    visible: {
        opacity: 1,
        y: 0,
    },
    hide: {
        y: 12,
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const styles: StyleSheetCSS = {
    container: {
        position: 'absolute',
        bottom: 64,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
    },
    
    terminal: {
        backgroundColor: '#000000',
        border: '1px solid #30b9e1',
        borderRadius: '4px',
        padding: '8px 12px',
        boxShadow: '0 0 20px rgba(15, 75, 131, 0.3)',
        minWidth: '280px',
    },
    
    promptLine: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: '14px',
    },
    
    prompt: {
        color: '#30b9e1',
        fontWeight: 'bold',
        textShadow: '0 0 5px #30b9e1',
    },
    
    command: {
        color: '#30b9e1',
        marginLeft: '4px',
    },
    
    cursor: {
        color: '#30b9e1',
        marginLeft: '2px',
        fontWeight: 'bold',
        textShadow: '0 0 5px #30b9e1',
    },
};

export default HelpPrompt;