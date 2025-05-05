/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// supabase
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import Emoji from '@tiptap-pro/extension-emoji'


// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { NodeButton } from "@/components/tiptap-ui/node-button";
import {
    HighlightPopover,
    HighlightContent,
    HighlighterButton,
} from "@/components/tiptap-ui/highlight-popover";
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import defaultContent from "@/components/tiptap-templates/simple/data/content.json";
import PostBar from "@/components/create/post-bar";

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    isMobile,
}: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
}) => {
    return (
        <>
            <Spacer />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
                <ListDropdownMenu
                    types={["bulletList", "orderedList", "taskList"]}
                />
                <NodeButton type="codeBlock" />
                <NodeButton type="blockquote" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <HighlightPopover />
                ) : (
                    <HighlighterButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? (
                    <LinkPopover />
                ) : (
                    <LinkButton onClick={onLinkClick} />
                )}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Add" />
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}

            <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup>
        </>
    );
};

const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: "highlighter" | "link";
    onBack: () => void;
}) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? <HighlightContent /> : <LinkContent />}
    </>
);

export function SimpleEditor({
    id,
    initialContent,
    loggedId,
    authorId,
    isPublic,
}: {
    id: string;
    initialContent: object;
    loggedId: string;
    authorId: string;
    isPublic: boolean;
}) {
    console.log("initialContent", initialContent);
    const supabase = createClient();

    const isMobile = useMobile();
    const windowSize = useWindowSize();
    const [mobileView, setMobileView] = React.useState<
        "main" | "highlighter" | "link"
    >("main");
    const [rect, setRect] = React.useState<
        Pick<DOMRect, "x" | "y" | "width" | "height">
    >({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const toolbarRef = React.useRef<HTMLDivElement>(null);

    // const supabase = createClient();

    // const [loggedId, setLoggedId] = useState("");
    // const [authorId, setAuthorId] = useState("");
    // const [initialContent, setInitialContent] = useState({});
    // const [loading, setLoading] = useState(true);

    // const contentRef = React.useRef(defaultContent);

    // useEffect(() => {
    //     // fetch data
    //     const contentfetch = async () => {
    //         const { data: session } = await supabase.auth.getSession();
    //         console.log(session);

    //         if (!session) {
    //             return;
    //         }

    //         const exists = await supabase
    //             .from("posts")
    //             .select("*")
    //             .eq("room", id);

    //         if (exists.data?.length === 0) {
    //             setAuthorId(session!.session!.user.id);
    //             console.log("Hmm, parece que esse post não existe ainda");
    //             console.log("Um momento, estou criando...");
    //             await supabase.from("posts").insert([
    //                 {
    //                     room: id,
    //                     content: "",
    //                     author_id: session!.session!.user.id,
    //                 },
    //             ]);

    //             console.log("Post criado com sucesso!");
    //             // setInitialContent();

    //             setLoading(false);
    //             return;
    //         } else {
    //             console.log("Post encontrado!");
    //             const { data, error } = await supabase
    //                 .from("posts")
    //                 .select("content,title,image,author_id")
    //                 .eq("room", id)
    //                 .single();

    //             if (data) {
    //                 const cont = data.content;
    //                 setInitialContent(cont);
    //                 console.log("data", data);
    //                 console.log("content being set:", cont);

    //                 setTimeout(() => {
    //                     setInitialContent(cont);
    //                     console.log("data dps de 5s", initialContent);
    //                 }, 5000);
    //             }

    //             if (error) {
    //                 console.error("error", error);
    //                 return;
    //             }

    //             // setInitialContent(data.content);
    //             // setTitle(data.title);
    //             // setImage(data.image);
    //             // setAuthorId(data.author_id);
    //             // console.log(data.author_id);
    //             setLoading(false);
    //         }
    //     };

    //     const checkIfCanSee = async () => {
    //         const { data } = await supabase.auth.getSession();

    //         if (data.session) {
    //             setLoggedId(data.session.user.id);
    //             console.log(data.session.user.id);
    //             // console.log(authorId, loggedId);
    //         }
    //     };

    //     contentfetch();
    //     checkIfCanSee();

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    React.useEffect(() => {
        const updateRect = () => {
            setRect(document.body.getBoundingClientRect());
        };

        updateRect();

        const resizeObserver = new ResizeObserver(updateRect);
        resizeObserver.observe(document.body);

        window.addEventListener("scroll", updateRect);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("scroll", updateRect);
        };
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
            },
        },
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Underline,
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,

    Emoji.configure({
        enableEmoticons: true,
      }),  
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
            TrailingNode,
            Link.configure({ openOnClick: false }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            console.log("Editor content:", json);
            // Save the content to the database
            supabase
                .from("posts")
                .update({ content: json })
                .eq("room", id)
                .then(() => {
                    console.log("Content updated successfully!");
                })

            // Check if the first element is a heading
            // and if it has a title
            if (json.content) {
                const title =
                    json.content[0].content && json.content[0].type == "heading"
                        ? json.content[0].content[0].text
                        : "";
                console.log("title:", title);

                supabase
                    .from("posts")
                    .update({ title: title })
                    .eq("room", id)
                    .then(() => {
                        console.log("Title updated successfully!");
                    });
            }

            // Check if the first element is a image
            // and if it has a image
            if (json.content) {
                let image = "";
                if (json.content) {
                    for (const node of json.content) {
                        if (node.type === "image" && node.attrs?.src) {
                            image = node.attrs.src;
                            break;
                        }
                    }
                }
                console.log("image:", image);

                supabase
                    .from("posts")
                    .update({ image: image })
                    .eq("room", id)
                    .then(() => {
                        console.log("Image updated successfully!");
                    });
            }
        },
    });

    React.useEffect(() => {
        const checkCursorVisibility = () => {
            if (!editor || !toolbarRef.current) return;

            const { state, view } = editor;
            if (!view.hasFocus()) return;

            const { from } = state.selection;
            const cursorCoords = view.coordsAtPos(from);

            if (windowSize.height < rect.height) {
                if (cursorCoords && toolbarRef.current) {
                    const toolbarHeight =
                        toolbarRef.current.getBoundingClientRect().height;
                    const isEnoughSpace =
                        windowSize.height - cursorCoords.top - toolbarHeight >
                        0;

                    // If not enough space, scroll until the cursor is the middle of the screen
                    if (!isEnoughSpace) {
                        const scrollY =
                            cursorCoords.top -
                            windowSize.height / 2 +
                            toolbarHeight;
                        window.scrollTo({
                            top: scrollY,
                            behavior: "smooth",
                        });
                    }
                }
            }
        };

        checkCursorVisibility();
    }, [editor, rect.height, windowSize.height]);

    React.useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);

    return (
                <EditorContext.Provider value={{ editor }}>
                    <PostBar id={id} authorId={authorId} loggedId={loggedId} isPublic={isPublic} />
                    <Toolbar
                        ref={toolbarRef}
                        style={
                            isMobile
                                ? {
                                      bottom: `calc(100% - ${
                                          windowSize.height - rect.y
                                      }px)`,
                                  }
                                : {}
                        }
                    >
                        {mobileView === "main" ? (
                            <MainToolbarContent
                                onHighlighterClick={() =>
                                    setMobileView("highlighter")
                                }
                                onLinkClick={() => setMobileView("link")}
                                isMobile={isMobile}
                            />
                        ) : (
                            <MobileToolbarContent
                                type={
                                    mobileView === "highlighter"
                                        ? "highlighter"
                                        : "link"
                                }
                                onBack={() => setMobileView("main")}
                            />
                        )}
                    </Toolbar>

                    <div className="content-wrapper">
                        <EditorContent
                            editor={editor}
                            role="presentation"
                            className="simple-editor-content"
                        />
                    </div>
                </EditorContext.Provider>
    );
}
