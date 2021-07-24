/*
 *  (GBONDS) GNOME based Savings Bond Inventory Program
 *
 *  sbw4.h:  SBW version 4 file format definitions
 *
 *  Copyright (C) 2002  Jim Evins <evins@snaught.com>.
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

#ifndef __SBW4_H__
#define __SBW4_H__

#include "types.h"

#define SBW4_EPOCH GB_DATE(APR, 1941)

typedef struct
{
	guint16 rdate;
	guint16 dummy1;
	guint16 n_bonds;
	guint16 dummy3;
	guint16 dummy4;
	guint16 dummy5;
} SBW4_Head;

#define SBW4_CBOND_SIZE 5

typedef struct __attribute__((packed))
{
	guint32 dummy0;	 //00 00 00 00
	guint32 dummy1;	 // d7 43
	guint32 dummy2;	 //0 0 0 0
	guint32 dummy3;	 // 0 0 10 40
	guint32 dummy4;	 // 0 0 0 0
	guint32 dummy5;	 // 0 0 0 0
	guint32 denom;	 // 64 0 0 0
	guint32 mdate;	 //c9 03 0 0
	guint32 dummy8;	 //0 0 0 0
	guint32 dummy9;	 //ae 07 . .
	guint32 idate;	 //61 02 0 0
	guint32 dummy11; // 0 0 0 0
	guint32 dummy12; //0 0 49 40
	guint32 adate;	 //93 03 0 0
	guint32 dummy14; //ff ff ff ff
	guint32 dummy15; //0 0 0 0
	guint32 dummy16; //0 0 0 0
	guint32 dummy17; //0 0 0 40
	guint32 dummy18; //0a d7 . .
	guint32 dummy19; //0 0 0 0
	guint32 dummy20; //58 8f . .
} SBW4_BondInfoFixed;

#endif /* __SBW4_H__ */
