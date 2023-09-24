import { Button, Divider, Group, Modal, NumberInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import { IconPhotoCog } from '@tabler/icons-react';
import { ImageViewAttributes } from './Image';
import classes from './ImageViewBubbleMenu.module.css';

export interface ImageViewBubbleMenuProps {
  width: number;
  height: number;
  ratio: number;
  onSubmit: (attr: Partial<ImageViewAttributes>) => void;
}

export function ImageViewBubbleMenu({ width, height, ratio, onSubmit }: ImageViewBubbleMenuProps) {
  const [opened, { open, close }] = useDisclosure();
  const form = useForm();

  const handleSubmit = form.onSubmit(values => {
    onSubmit(values);
    close();
  });

  return (
    <div className={classes.root}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Control
          onClick={() => {
            form.setValues({ width, height });
            open();
          }}
        >
          <IconPhotoCog stroke={1.5} size="1rem" />
        </RichTextEditor.Control>
      </RichTextEditor.ControlsGroup>

      <Modal
        title={
          <Group gap="xs">
            <IconPhotoCog width={20} />
            <Text fw="bold">Image Config</Text>
          </Group>
        }
        opened={opened}
        onClose={close}
        withinPortal
        centered
      >
        <Divider mb="md" />

        <form onSubmit={handleSubmit}>
          <Stack>
            <NumberInput
              label="Width"
              {...form.getInputProps('width')}
              onChange={width => typeof width === 'number' && form.setValues({ width, height: width / ratio })}
            />
            <NumberInput
              label="Height"
              {...form.getInputProps('height')}
              onChange={height => typeof height === 'number' && form.setValues({ width: height * ratio, height })}
            />
            {/* <Checkbox label="Lock aspect ratio" checked readOnly /> */}

            <Button type="submit">Confirm</Button>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
