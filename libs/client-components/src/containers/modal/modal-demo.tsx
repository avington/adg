import React from 'react';
import { Modal } from './modal';
import { useModal } from './use-modal';
import { Button } from '../../buttons/button';

/**
 * Demo component showing how to use the Modal component
 */
export const ModalDemo: React.FC = () => {
  const { isOpen, open, close } = useModal();

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Example Modal"
        closeOnBackdropClick={true}
        closeOnEscape={true}
        showCloseButton={true}
      >
        <div>
          <p>
            This is the modal content. You can put any React components here.
          </p>
          <p>The modal will close when you:</p>
          <ul>
            <li>Click the X button</li>
            <li>Press the Escape key</li>
            <li>Click outside the modal</li>
          </ul>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={close} mode="primary">
              Close Modal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalDemo;
