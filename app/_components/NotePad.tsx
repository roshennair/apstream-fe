'use client';

import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const NotePad = ({
	content,
	setContent,
}: {
	content: string | null;
	// eslint-disable-next-line no-unused-vars
	setContent: (content: string) => void;
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({}),
			Highlight,
			Underline,
			Link,
			Superscript,
			Subscript,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		content: content || '',
		autofocus: true,
		injectCSS: false,
	});

	if (editor) {
		editor.on('update', () => {
			setContent(editor.getHTML());
		});
	}

	return (
		<RichTextEditor editor={editor}>
			<RichTextEditor.Toolbar>
				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Bold />
					<RichTextEditor.Italic />
					<RichTextEditor.Underline />
					<RichTextEditor.Strikethrough />
					<RichTextEditor.ClearFormatting />
					<RichTextEditor.Highlight />
					<RichTextEditor.Code />
				</RichTextEditor.ControlsGroup>

				<RichTextEditor.ControlsGroup>
					<RichTextEditor.H1 />
					<RichTextEditor.H2 />
					<RichTextEditor.H3 />
					<RichTextEditor.H4 />
				</RichTextEditor.ControlsGroup>

				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Blockquote />
					<RichTextEditor.Hr />
					<RichTextEditor.BulletList />
					<RichTextEditor.OrderedList />
					<RichTextEditor.Subscript />
					<RichTextEditor.Superscript />
				</RichTextEditor.ControlsGroup>

				<RichTextEditor.ControlsGroup>
					<RichTextEditor.AlignLeft />
					<RichTextEditor.AlignCenter />
					<RichTextEditor.AlignJustify />
					<RichTextEditor.AlignRight />
				</RichTextEditor.ControlsGroup>
			</RichTextEditor.Toolbar>
			<RichTextEditor.Content className="prose" />
		</RichTextEditor>
	);
};

export default NotePad;
