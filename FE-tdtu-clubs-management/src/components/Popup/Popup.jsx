import { Modal } from 'antd';
import { useEffect } from 'react';

function Popup({ serverMessage, signal, setSignal }) {
    const [modal, contextHolder] = Modal.useModal();
    const msg = serverMessage.msg;
    const countDown = () => {
        let secondsToGo = 5;
        if (msg.type === 'success') {
            var instance = modal.success({
                title: msg.content,
                content: `Thông báo sẽ ẩn đi sau ${secondsToGo} giây.`,
            });
        } else {
            let instance = modal.error({
                title: msg.content,
                content: `Thông báo sẽ ẩn đi sau ${secondsToGo} giây.`,
            });

        }
        const timer = setInterval(() => {
            secondsToGo -= 1;
            instance.update({
                content: `Thông báo sẽ ẩn đi sau ${secondsToGo} giây.`,
            });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
            setSignal(false); // Reset signal sau khi popup đóng
        }, secondsToGo * 1000);
    };
    useEffect(() => {
        if (signal) {
            countDown();
        }
    }, [signal]);
    return (
        <>
            {contextHolder}
        </>
    );
}

export default Popup;