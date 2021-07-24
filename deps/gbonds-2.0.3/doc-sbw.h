/*
 *  (GBONDS) GNOME based Savings Bond Inventory Program
 *
 *  doc-sbw.h:  gbonds sbw import module header file
 *
 *  Copyright (C) 2001-2003  Jim Evins <evins@snaught.com>.
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307 USA
 */
#ifndef __DOC_SBW_H__
#define __DOC_SBW_H__

#include "doc.h"

G_BEGIN_DECLS

extern gbDoc *gb_doc_sbw_open(const gchar *filename, gbStatus *status);

G_END_DECLS

#endif /* __DOC_SBW_H__ */
