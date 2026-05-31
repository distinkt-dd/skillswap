import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const SuccessExampleContent = ({ onClose }: { onClose: () => void }) => (
  <>
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '40px',
        }}
      >
        ✓
      </div>
    </div>

    <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: 600 }}>Вы предложили обмен</h2>
    <p style={{ color: '#666', marginBottom: '32px', lineHeight: 1.4 }}>
      Теперь дождитесь подтверждения. Вам придёт уведомление
    </p>

    <button
      onClick={onClose}
      style={{
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 40px',
        fontSize: '16px',
        fontWeight: 500,
        width: '100%',
        cursor: 'pointer',
      }}
    >
      Готово
    </button>
  </>
);

export const SuccessModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Открыть модалку</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <SuccessExampleContent onClose={() => setIsOpen(false)} />
        </Modal>
      </>
    );
  },
};
