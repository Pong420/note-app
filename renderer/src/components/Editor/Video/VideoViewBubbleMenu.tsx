import { Button, Divider, Group, Modal, NumberInput, Stack, Text, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import {
  IconMovie,
  IconRepeat,
  IconPhotoCog,
  IconPlayerPlayFilled,
  IconAdjustmentsHorizontal
} from '@tabler/icons-react';
import { VideoOptions, VideoViewAttributes } from './Video';
import classes from './VideoViewBubbleMenu.module.css';

export interface VideoViewBubbleMenuProps extends VideoOptions {
  width: number;
  height: number;
  ratio: number;
  update: (attr: Partial<VideoViewAttributes>) => void;
}

export function VideoViewBubbleMenu({ width, height, ratio, update, ...props }: VideoViewBubbleMenuProps) {
  const [opened, { open, close }] = useDisclosure();
  const form = useForm();

  const handleSubmit = form.onSubmit(values => {
    update(values);
    close();
  });

  return (
    <div className={classes.root}>
      <Paper p={5} shadow="md" withBorder>
        <Group gap={2}>
          <RichTextEditor.Control
            onClick={() => {
              form.setValues({ width, height });
              open();
            }}
          >
            <IconMovie stroke={1.5} size="1rem" />
          </RichTextEditor.Control>

          <RichTextEditor.Control active={props.autoPlay} onClick={() => update({ autoPlay: !props.autoPlay })}>
            <IconPlayerPlayFilled stroke={1.5} size="1rem" />
          </RichTextEditor.Control>

          <RichTextEditor.Control active={props.loop} onClick={() => update({ loop: !props.loop })}>
            <IconRepeat stroke={1.5} size="1rem" />
          </RichTextEditor.Control>

          <RichTextEditor.Control active={props.controls} onClick={() => update({ controls: !props.controls })}>
            <IconAdjustmentsHorizontal stroke={1.5} size="1rem" />
          </RichTextEditor.Control>
        </Group>
      </Paper>

      <Modal
        title={
          <Group gap="xs">
            <IconPhotoCog width={20} />
            <Text fw="bold">Video Config</Text>
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
