// 移动设备适配器
const MobileAdapter = {
    // 检测是否为移动设备
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // 初始化移动设备适配
    init() {
        if (this.isMobile()) {
            this.applyMobileStyles();
            this.setupMobileLayout();
            this.enhanceInputBehavior();
            this.optimizeScrolling();
        }
    },

    // 应用移动设备样式
    applyMobileStyles() {
        document.body.classList.add('mobile-device');
        
        // 添加移动设备专用样式
        const mobileStyles = `
            .mobile-device .main-content {
                margin-left: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                height: 100vh;
            }

            .mobile-device .sidebar {
                display: none !important;
            }

            .mobile-device .chat-messages {
                flex: 1;
                padding: 10px;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-device .message {
                max-width: 90%;
                margin: 8px;
            }

            .mobile-device .message-content {
                font-size: 14px;
                padding: 12px;
                line-height: 1.4;
            }

            .mobile-device .input-area {
                padding: 12px;
                position: sticky;
                bottom: 0;
                background: #fff;
                z-index: 10;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
            }

            .mobile-device .input-container {
                padding: 10px;
                border-radius: 18px;
            }

            .mobile-device #messageInput {
                font-size: 16px;
                min-height: 20px;
                max-height: 120px;
                overflow-y: auto;
                padding: 2px 0;
            }

            .mobile-device .bottom-buttons {
                flex-wrap: wrap;
                gap: 8px;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
            }

            .mobile-device .model-button {
                font-size: 12px;
                padding: 6px 10px;
                min-width: auto;
            }

            .mobile-device .send-button {
                width: 42px;
                height: 42px;
            }

            .mobile-device .code-block {
                margin: 8px 0;
                border-radius: 8px;
                max-width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-device .code-block pre {
                padding: 10px;
                font-size: 12px;
            }

            .mobile-device .code-block .code-header {
                padding: 6px 10px;
                font-size: 11px;
            }

            .mobile-device .code-copy-button {
                padding: 4px 8px;
                font-size: 10px;
            }

            .mobile-device .thinking-time {
                bottom: 70px;
                right: 10px;
                font-size: 11px;
            }

            .mobile-device .welcome-text {
                font-size: 14px;
                line-height: 1.4;
            }

            .mobile-device .tech-badge {
                font-size: 11px;
                padding: 4px 8px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);
    },

    // 设置移动端布局
    setupMobileLayout() {
        // 向文档中添加视口元标记，确保移动设备上的缩放和渲染行为正确
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }

        // 确保网站是全屏可滚动的
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';

        // 隐藏侧边栏
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        // 隐藏快捷操作区
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.style.display = 'none';
        }
    },

    // 增强输入框行为
    enhanceInputBehavior() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;

        // 自动调整文本区域高度
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(120, this.scrollHeight) + 'px';
        });

        // 防止输入框获取焦点时页面弹跳
        messageInput.addEventListener('focus', function() {
            // 延迟执行，等待键盘显示
            setTimeout(() => {
                // 滚动到页面底部
                window.scrollTo(0, document.body.scrollHeight);
                
                // 确保输入框可见
                this.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 300);
        });
    },

    // 优化滚动体验
    optimizeScrolling() {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        // 添加惯性滚动
        chatMessages.style.webkitOverflowScrolling = 'touch';
        
        // 确保新消息出现时自动滚动到底部
        const scrollToBottom = () => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        
        // 创建一个观察器监视聊天内容的变化
        const observer = new MutationObserver(scrollToBottom);
        observer.observe(chatMessages, { childList: true, subtree: true });
        
        // 初始滚动到底部
        scrollToBottom();
    }
};

// 页面加载完成后初始化移动设备适配
document.addEventListener('DOMContentLoaded', () => {
    MobileAdapter.init();
});

// 防止iOS软键盘弹出时的页面缩放问题
window.addEventListener('resize', () => {
    if (MobileAdapter.isMobile() && document.activeElement.tagName === 'TEXTAREA') {
        // 等待键盘弹出完成
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    }
});