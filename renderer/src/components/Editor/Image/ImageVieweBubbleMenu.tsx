import { Button, Divider, Group, Modal, NumberInput, Stack, Text, createStyles } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import { IconPhotoCog } from '@tabler/icons-react';
import { ImageViewAttributes } from './Image';

export interface ImageViewBubbleMenuProps {
  width: number;
  height: number;
  ratio: number;
  onSubmit: (attr: Partial<ImageViewAttributes>) => void;
}

const useStyles = createStyles(() => {
  return {
    root: {
      position: 'absolute',
      bottom: -5,
      left: 0,
      transform: 'translate(0, 100%)',
      fontSize: 14,
      lineHeight: '1rem',
      width: 'fit-content',
      zIndex: 1
    }
  };
});

export function ImageViewBubbleMenu({ width, height, ratio, onSubmit }: ImageViewBubbleMenuProps) {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure();
  const form = useForm({
    initialValues: {
      width: typeof width === 'string' ? parseInt(width, 10) : width,
      height: typeof height === 'string' ? parseInt(height, 10) : height
    }
  });
  const handleSubmit = form.onSubmit(values => {
    onSubmit(values);
    close();
  });

  return (
    <div className={classes.root}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Control onClick={open}>
          <IconPhotoCog stroke={1.5} size="1rem" />
        </RichTextEditor.Control>
      </RichTextEditor.ControlsGroup>

      <Modal
        title={
          <Group spacing="xs">
            <IconPhotoCog width={20} />
            <Text weight="bold">Image Config</Text>
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
