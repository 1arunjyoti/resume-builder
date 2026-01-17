import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  UnderlineType,
  TableLayoutType,
} from "docx";
import type { Resume } from "@/db";

// Helper to sanitize text (remove invalid XML characters)
const sanitize = (str: string): string => {
  if (!str) return "";
  // Remove control characters 0-8, 11-12, 14-31, 127
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
};

// Helper to parse markdown-like bold/italic to TextRun[]
const parseMarkdown = (text: string, fontSize: number): TextRun[] => {
  if (!text) return [];
  const safeText = sanitize(text);
  const parts = safeText.split(/(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|\[.*?\]\(.*?\))/g);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return new TextRun({
        text: part.slice(2, -2),
        bold: true,
        size: fontSize * 2, // docx uses half-points
      });
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return new TextRun({
        text: part.slice(1, -1),
        italics: true,
        size: fontSize * 2,
      });
    }
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      return new TextRun({
        text: part.slice(3, -4),
        underline: { type: UnderlineType.SINGLE },
        size: fontSize * 2,
      });
    }
    // Simple link handling (just show text for now in docx)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const split = part.slice(1, -1).split("](");
      return new TextRun({
        text: split[0], // Display text
        size: fontSize * 2,
        color: "0563C1",
        underline: { type: UnderlineType.SINGLE },
      });
    }
    return new TextRun({
      text: part,
      size: fontSize * 2,
    });
  });
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Present";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const generateDocx = async (resume: Resume): Promise<Blob> => {
  const settings = resume.meta.layoutSettings || {};
  const baseFontSize = settings.fontSize || 10;
  const sectionMargin = settings.sectionMargin
    ? settings.sectionMargin * 20
    : 200; // approx scaling
  // Force single column for DOCX to ensure reliable pagination and ATS compatibility.
  // Word tables (used for 2-col) often fail to break across pages correctly.
  const columnCount =  1;
  const leftColWidth = settings.leftColumnWidth || 30;
  const lineHeight = (settings.lineHeight || 1.2) * 240; // 240 = 100%

  // Theme colors
  const themeColor = resume.meta.themeColor || "#000000";
  const colorTargets = settings.themeColorTarget || [
    "headings",
    "links",
    "icons",
    "decorations",
  ];
  const getColor = (target: string, fallback: string = "000000") => {
    return colorTargets.includes(target)
      ? themeColor.replace("#", "")
      : fallback;
  };

  // --- Section Generators ---

  const createSectionTitle = (title: string) => {
    return new Paragraph({
      text: sanitize(title).toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: sectionMargin, after: 100, line: lineHeight },
      border: {
        bottom: {
          color: getColor("decorations"),
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      run: {
        color: getColor("headings"),
        bold: true,
        size: (baseFontSize + 4) * 2,
        font: "Times New Roman",
      },
    });
  };

  const createSummary = () => {
    if (!resume.basics.summary) return null;
    return [
      createSectionTitle("Summary"),
      new Paragraph({
        children: parseMarkdown(resume.basics.summary, baseFontSize),
        spacing: { after: 200, line: lineHeight },
      }),
    ];
  };

  const createWork = () => {
    if (!resume.work || resume.work.length === 0) return null;
    return [
      createSectionTitle("Professional Experience"),
      ...resume.work.flatMap((exp) => [
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(exp.company),
              bold: true,
              size: (baseFontSize + 1) * 2,
            }),
            ...(exp.url
              ? [
                  new TextRun({
                    text: ` | ${sanitize(exp.url)}`,
                    size: baseFontSize * 2,
                    color: getColor("links", "0563C1"),
                  }),
                ]
              : []),
            new TextRun({
              text: `\t${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`,
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          tabStops: [
            {
              type: "right",
              position: 9000,
            },
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(exp.position),
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          spacing: { after: 100, line: lineHeight },
        }),
        ...(exp.summary
          ? [
              new Paragraph({
                children: parseMarkdown(exp.summary, baseFontSize),
              }),
            ]
          : []),
        ...(exp.highlights
          ? exp.highlights.map(
              (h) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: sanitize(h),
                      size: baseFontSize * 2,
                    }),
                  ],
                  bullet: { level: 0 },
                }),
            )
          : []),
        new Paragraph({ text: "", spacing: { after: 200, line: lineHeight } }), // Spacer
      ]),
    ];
  };

  const createEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;
    return [
      createSectionTitle("Education"),
      ...resume.education.flatMap((edu) => [
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(edu.institution),
              bold: true,
              size: (baseFontSize + 1) * 2,
            }),
            ...(edu.url
              ? [
                  new TextRun({
                    text: ` | ${sanitize(edu.url)}`,
                    size: baseFontSize * 2,
                    color: getColor("links", "0563C1"),
                  }),
                ]
              : []),
            new TextRun({
              text: `\t${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`,
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
          spacing: { line: lineHeight },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${sanitize(edu.studyType)} in ${sanitize(edu.area)}`,
              size: baseFontSize * 2,
            }),
          ],
          spacing: { line: lineHeight },
        }),
        ...(edu.score
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `GPA: ${edu.score}`,
                    size: baseFontSize * 2,
                  }),
                ],
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        ...(edu.courses && edu.courses.length > 0
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Courses: ${sanitize(edu.courses.join(", "))}`,
                    size: baseFontSize * 2,
                    italics: true,
                  }),
                ],
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        ...(edu.summary
          ? [
              new Paragraph({
                children: parseMarkdown(edu.summary, baseFontSize),
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        new Paragraph({ text: "", spacing: { after: 200, line: lineHeight } }),
      ]),
    ];
  };

  const createSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;
    return [
      createSectionTitle("Skills"),
      ...resume.skills.map(
        (skill) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `${sanitize(skill.name)}: `,
                bold: true,
                size: baseFontSize * 2,
              }),
              new TextRun({
                text: sanitize(skill.keywords.join(", ")),
                size: baseFontSize * 2,
              }),
            ],
            bullet: { level: 0 },
            spacing: { line: lineHeight },
          }),
      ),
    ];
  };

  const createProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;
    console.log('[DOCX Generator] Creating projects section, count:', resume.projects.length);
    const content = [
      createSectionTitle("Projects"),
      ...resume.projects.flatMap((proj, index) => {
        console.log(`[DOCX Generator] Processing project ${index + 1}: ${proj.name}`);
        const projectContent = [
          new Paragraph({
            children: [
              new TextRun({
                text: sanitize(proj.name),
                bold: true,
                size: (baseFontSize + 1) * 2,
              }),
              new TextRun({
                text: `\t${formatDate(proj.startDate)} — ${formatDate(proj.endDate || "")}`,
                italics: true,
                size: baseFontSize * 2,
              }),
            ],
            tabStops: [{ type: "right", position: 9000 }],
            spacing: { line: lineHeight },
          }),
          ...(proj.url
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: sanitize(proj.url),
                      size: baseFontSize * 2,
                      color: getColor("links", "0563C1"),
                    }),
                  ],
                  spacing: { line: lineHeight },
                }),
              ]
            : []),
          new Paragraph({
            children: parseMarkdown(proj.description, baseFontSize),
            spacing: { line: lineHeight },
          }),
          ...(proj.highlights
            ? proj.highlights.map(
                (h) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: sanitize(h),
                        size: baseFontSize * 2,
                      }),
                    ],
                    bullet: { level: 0 },
                  }),
              )
            : []),
          ...(proj.keywords && proj.keywords.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Technologies: ${sanitize(proj.keywords.join(", "))}`,
                      size: baseFontSize * 2,
                      italics: true,
                    }),
                  ],
                  spacing: { line: lineHeight },
                }),
              ]
            : []),
          new Paragraph({ text: "", spacing: { after: 200, line: lineHeight } }),
        ];
        console.log(`[DOCX Generator] Project ${index + 1} generated ${projectContent.length} paragraphs`);
        return projectContent;
      }),
    ];
    console.log('[DOCX Generator] Projects section total items:', content.length);
    return content;
  };

  const createCertificates = () => {
    if (!resume.certificates || resume.certificates.length === 0) return null;
    return [
      createSectionTitle("Certificates"),
      ...resume.certificates.flatMap((cert) => [
        new Paragraph({
          children: [
            new TextRun({
              text: `${sanitize(cert.name)} - ${sanitize(cert.issuer)}`,
              bold: true,
              size: baseFontSize * 2,
            }),
            new TextRun({
              text: `\t${formatDate(cert.date)}`,
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
          bullet: { level: 0 },
          spacing: { line: lineHeight },
        }),
        ...(cert.url
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: sanitize(cert.url),
                    size: baseFontSize * 2,
                    color: getColor("links", "0563C1"),
                  }),
                ],
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        ...(cert.summary
          ? [
              new Paragraph({
                children: parseMarkdown(cert.summary, baseFontSize),
                spacing: { line: lineHeight },
              }),
            ]
          : []),
      ]),
    ];
  };

  const createLanguages = () => {
    if (!resume.languages || resume.languages.length === 0) return null;
    return [
      createSectionTitle("Languages"),
      new Paragraph({
        children: resume.languages.flatMap((lang, index) => [
          new TextRun({
            text: `${sanitize(lang.language)} (${sanitize(lang.fluency)})`,
            size: baseFontSize * 2,
          }),
          index < resume.languages.length - 1
            ? new TextRun({ text: " • ", size: baseFontSize * 2 })
            : new TextRun(""),
        ]),
        spacing: { line: lineHeight },
      }),
    ];
  };

  const createInterests = () => {
    if (!resume.interests || resume.interests.length === 0) return null;
    return [
      createSectionTitle("Interests"),
      ...resume.interests.map(
        (interest) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `${sanitize(interest.name)}: `,
                bold: true,
                size: baseFontSize * 2,
              }),
              new TextRun({
                text: sanitize(interest.keywords?.join(", ") || ""),
                size: baseFontSize * 2,
              }),
            ],
            bullet: { level: 0 },
            spacing: { line: lineHeight },
          }),
      ),
    ];
  };

  const createPublications = () => {
    if (!resume.publications || resume.publications.length === 0) return null;
    return [
      createSectionTitle("Publications"),
      ...resume.publications.flatMap((pub) => [
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(pub.name),
              bold: true,
              size: baseFontSize * 2,
            }),
            new TextRun({
              text: ` - ${sanitize(pub.publisher)}`,
              size: baseFontSize * 2,
            }),
            new TextRun({
              text: `\t${formatDate(pub.releaseDate)}`,
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
          bullet: { level: 0 },
          spacing: { line: lineHeight },
        }),
        ...(pub.url
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: sanitize(pub.url),
                    size: baseFontSize * 2,
                    color: getColor("links", "0563C1"),
                  }),
                ],
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        ...(pub.summary
          ? [
              new Paragraph({
                children: parseMarkdown(pub.summary, baseFontSize),
                spacing: { after: 100, line: lineHeight },
              }),
            ]
          : []),
      ]),
    ];
  };

  const createAwards = () => {
    if (!resume.awards || resume.awards.length === 0) return null;
    return [
      createSectionTitle("Awards"),
      ...resume.awards.flatMap((award) => [
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(award.title),
              bold: true,
              size: baseFontSize * 2,
            }),
            new TextRun({
              text: ` - ${sanitize(award.awarder)}`,
              size: baseFontSize * 2,
            }),
            new TextRun({
              text: `\t${formatDate(award.date)}`,
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
          bullet: { level: 0 },
          spacing: { line: lineHeight },
        }),
        ...(award.summary
          ? [
              new Paragraph({
                children: parseMarkdown(award.summary, baseFontSize),
                spacing: { after: 100, line: lineHeight },
              }),
            ]
          : []),
      ]),
    ];
  };

  const createReferences = () => {
    if (!resume.references || resume.references.length === 0) return null;
    return [
      createSectionTitle("References"),
      ...resume.references.flatMap((ref) => [
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(ref.name),
              bold: true,
              size: baseFontSize * 2,
            }),
            new TextRun({
              text: ` - ${sanitize(ref.position || "")}`,
              italics: true,
              size: baseFontSize * 2,
            }),
          ],
          bullet: { level: 0 },
        }),
        ...(ref.reference
          ? [
              new Paragraph({
                children: parseMarkdown(ref.reference, baseFontSize),
                spacing: { after: 200, line: lineHeight },
              }),
            ]
          : []),
      ]),
    ];
  };

  const createCustom = () => {
    if (!resume.custom || resume.custom.length === 0) return null;
    return resume.custom.flatMap((section) => [
      createSectionTitle(section.name || "Custom Section"),
      ...(section.items || []).flatMap((item) => [
        new Paragraph({
          children: [
            new TextRun({
              text: sanitize(item.name),
              bold: true,
              size: baseFontSize * 2,
            }),
            ...(item.date
              ? [
                  new TextRun({
                    text: `\t${formatDate(item.date)}`,
                    italics: true,
                    size: baseFontSize * 2,
                  }),
                ]
              : []),
          ],
          tabStops: [{ type: "right", position: 9000 }],
          bullet: { level: 0 },
          spacing: { line: lineHeight },
        }),
        ...(item.description
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: sanitize(item.description),
                    size: baseFontSize * 2,
                  }),
                ],
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        ...(item.url
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: sanitize(item.url),
                    size: baseFontSize * 2,
                    color: getColor("links", "0563C1"),
                  }),
                ],
                spacing: { line: lineHeight },
              }),
            ]
          : []),
        ...(item.summary
          ? [
              new Paragraph({
                children: parseMarkdown(item.summary, baseFontSize),
                spacing: { line: lineHeight },
              }),
            ]
          : []),
      ]),
    ]);
  };

  // --- Layout Assembly ---

  const sectionGenerators: Record<string, () => (Paragraph | Table)[] | null> = {
    summary: createSummary,
    work: createWork,
    education: createEducation,
    skills: createSkills,
    projects: createProjects,
    certificates: createCertificates,
    languages: createLanguages,
    interests: createInterests,
    publications: createPublications,
    awards: createAwards,
    references: createReferences,
    custom: createCustom,
  };

  const order = settings.sectionOrder || [
    "summary",
    "work",
    "education",
    "skills",
    "projects",
  ];

  const children: (Paragraph | Table)[] = [];

  // Header
  children.push(
    new Paragraph({
      text: sanitize(resume.basics.name || "YOUR NAME").toUpperCase(),
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      run: {
        size: 28 * 2,
        bold: true,
        color: getColor("name"),
        font: "Times New Roman",
      },
      spacing: { line: lineHeight },
    }),
  );

  children.push(
    new Paragraph({
      text: sanitize(resume.basics.label || ""),
      alignment: AlignmentType.CENTER,
      run: {
        size: 14 * 2,
        color: getColor("title", "666666"),
        font: "Times New Roman",
      },
      spacing: { after: 200, line: lineHeight },
    }),
  );

  // Contact Info
  const locationStr = [resume.basics.location.city, resume.basics.location.country].filter(Boolean).join(", ");
  const contactParts = [
    resume.basics.email,
    resume.basics.phone,
    locationStr,
    resume.basics.url,
  ].filter(Boolean);

  // Add profiles (GitHub, LinkedIn, etc.)
  const profileNames = resume.basics.profiles?.map(p => p.network) || [];

  children.push(
    new Paragraph({
      children: [
        ...contactParts.flatMap((part, index) => [
          new TextRun({
            text: sanitize(part!),
            size: baseFontSize * 2,
          }),
          index < contactParts.length - 1 || profileNames.length > 0
            ? new TextRun({ text: " | ", size: baseFontSize * 2 })
            : new TextRun(""),
        ]),
        ...profileNames.flatMap((name, index) => [
          new TextRun({
            text: sanitize(name),
            size: baseFontSize * 2,
            color: getColor("links", "0563C1"),
          }),
          index < profileNames.length - 1
            ? new TextRun({ text: " | ", size: baseFontSize * 2 })
            : new TextRun(""),
        ]),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400, line: lineHeight },
      border: {
        bottom: {
          color: getColor("decorations"),
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
  );

  // Body
  if (columnCount === 1) {
    order.forEach((sectionId) => {
      const gen = sectionGenerators[sectionId];
      if (gen) {
        const content = gen();
        if (content) children.push(...content);
      }
    });
  } else {
    // 2 Column Layout
    const LHS_SECTIONS = [
      "skills",
      "education",
      "languages",
      "interests",
      "awards",
      "certificates",
      "references",
    ];

    // Sort sections
    const leftSections = order.filter((id) => LHS_SECTIONS.includes(id));
    const rightSections = order.filter((id) => !LHS_SECTIONS.includes(id));

    const leftContent: (Paragraph | Table)[] = [];
    leftSections.forEach((id) => {
      const gen = sectionGenerators[id];
      if (gen) {
        const c = gen();
        if (c) leftContent.push(...c);
      }
    });

    const rightContent: (Paragraph | Table)[] = [];
    rightSections.forEach((id) => {
      const gen = sectionGenerators[id];
      if (gen) {
        const c = gen();
        if (c) rightContent.push(...c);
      }
    });

    // A4 width = 11906 dx. Margins = 500 left + 500 right = 1000.
    // Usable width = 10906.
    const tableWidth = 10906;
    const col1Width = Math.floor((tableWidth * leftColWidth) / 100);
    const col2Width = tableWidth - col1Width;

    const table = new Table({
      layout: TableLayoutType.FIXED,
      width: {
        size: tableWidth,
        type: WidthType.DXA,
      },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
      },
      rows: [
        new TableRow({
          cantSplit: false,
          children: [
            new TableCell({
              width: {
                size: col1Width,
                type: WidthType.DXA,
              },
              children: leftContent.length ? leftContent : [new Paragraph("")],
            }),
            new TableCell({
              width: {
                size: col2Width,
                type: WidthType.DXA,
              },
              children: rightContent.length
                ? rightContent
                : [new Paragraph("")],
              margins: {
                left: 400,
              },
            }),
          ],
        }),
      ],
    });
    children.push(table);
  }

  // Debug: Log how many elements are being added
  console.log('[DOCX Generator] Total children elements:', children.length);
  console.log('[DOCX Generator] Children breakdown:', children.map(c => c.constructor.name));

  try {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 12240, // 8.5 inches in twips (8.5 * 1440)
                height: 15840, // 11 inches in twips (11 * 1440) - US Letter
              },
              margin: {
                top: 1440, // 1 inch in twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    console.log('[DOCX Generator] Buffer size:', buffer.byteLength, 'bytes');
    // Convert Buffer to Uint8Array for browser Blob compatibility
    const uint8Array = new Uint8Array(buffer);
    return new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  } catch (error) {
    console.error('[DOCX Generator] Error creating document:', error);
    throw error;
  }
};
