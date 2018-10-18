//
//  EUExFile.m
//  AppCan
//
//  Created by AppCan on 11-9-8.
//  Copyright 2011 AppCan. All rights reserved.
//

#import "EUExFile.h"
#import "EUExFileMgr.h"
//#import "BUtility.h"
#import "File.h"

@implementation EUExFile
@synthesize fileUrl;
@synthesize fileHandle;
@synthesize appFilePath;
@synthesize fileHasOpened;
@synthesize OS_offset,currentLength;
@synthesize keyString;

-(BOOL)initWithFileType:(int)fileType_ path:(NSString *)inPath mode:(int)mode_ euexObj:(EUExFileMgr *)euexObj_{
	fileType = fileType_;
	euexObj = euexObj_;
	self.appFilePath = inPath;
	NSRange range = [inPath rangeOfString:@"Documents"];
	if (range.length>0) {
		self.fileUrl = [inPath substringFromIndex:range.location+9];
	}else {
		NSRange rangeRes = [inPath rangeOfString:@".app"];
        if (rangeRes.length>0) {
            self.fileUrl = [inPath substringFromIndex:rangeRes.location+4];
        }
	}
	if (fileType_ == F_TYPE_DIR) {
		if (![File fileIsExist:inPath]) {
			if ([File createDir:inPath]) {
				return YES;
			}else {
				return NO;
			}
		} else {
			return YES;
		}
	}
    
    if (mode_ & (F_FILE_OPEN_MODE_NEW | F_FILE_OPEN_MODE_WRITE) && ![File fileIsExist:inPath]) {
        NSString *docPath = [inPath substringWithRange:NSMakeRange(0, [inPath length]-([[inPath lastPathComponent] length]))];
        if (![File fileIsExist:docPath]) {
            [File createDir:docPath];
        }
        return [File createFile:inPath];
    }
    return [File fileIsExist:inPath];
} 

//写文件
-(BOOL)writeWithData:(NSString *)inData option:(uexFileMgrFileWritingOption)option {
	if (appFilePath == nil) {
		return NO;
	}
    
    NSData *writer;
    if (option & uexFileMgrFileWritingOptionBase64Decoding) {
        writer = [[NSData alloc]initWithBase64Encoding:inData];
    }else{
        writer = [inData dataUsingEncoding:NSUTF8StringEncoding];
    }
    
    if (!writer) {
        return NO;
    }
    
	fileHandle = [NSFileHandle fileHandleForWritingAtPath:appFilePath];
	if (fileHandle == nil) {
		return NO;
    }
    
    if (self.keyString) {
        [fileHandle truncateFileAtOffset:0];
        writer = [self rc4WithInput:writer key:self.keyString];
        [fileHandle writeData:writer];
    } else {
        if (option & uexFileMgrFileWritingOptionSeekingToEnd) {
            [fileHandle seekToEndOfFile];
        } else {
            [fileHandle truncateFileAtOffset:0];
        }
        [fileHandle writeData:writer];
    }
    
 	[fileHandle closeFile];
    return YES;
}

-(long long)seek:(NSString*)inPos{
	long long seekLocation = [inPos longLongValue];
    offset = seekLocation;
	//跳转到指定位置
	fileHandle = [NSFileHandle fileHandleForReadingAtPath:appFilePath];
	if (fileHandle==nil) {
		return -1;
	}
    if(seekLocation > self.getSize.longLongValue){
        [fileHandle seekToEndOfFile];
    }else{
        [fileHandle seekToFileOffset:seekLocation];
    }
	
    ACLogDebug(@"offset: %lld",fileHandle.offsetInFile);
    offset = fileHandle.offsetInFile;
    return offset;
}
-(long long)seekBeginOfFile{
	return [self seek:0];
	
}
-(long long)seekEndOfFile{
	fileHandle = [NSFileHandle fileHandleForReadingAtPath:appFilePath];
	if (fileHandle==nil) {
		return -1;
	}
	[fileHandle seekToEndOfFile];
    offset = fileHandle.offsetInFile;
    
    return offset;
}

- (NSData *)rc4WithInput:(NSData *)aData key:(NSString *)aKey {
    
    NSString * aInput = [[NSString alloc] initWithData:aData encoding:NSUTF8StringEncoding];
    
    NSMutableArray * iS = [[NSMutableArray alloc] initWithCapacity:256];
    NSMutableArray * iK = [[NSMutableArray alloc] initWithCapacity:256];
    
    for (int i = 0; i < 256; i ++) {
        
        [iS addObject:[NSNumber numberWithInt:i]];
        
    }
    
    int j = 1;
    
    for (short i = 0; i < 256; i ++) {
        
        UniChar c = [aKey characterAtIndex:i % aKey.length];
        
        [iK addObject:[NSNumber numberWithChar:c]];
        
    }
    
    j = 0;
    
    for (int i = 0; i < 255; i ++) {
        
        int is = [[iS objectAtIndex:i] intValue];
        
        UniChar ik = (UniChar)[[iK objectAtIndex:i] charValue];
        
        j = (j + is + ik) % 256;
        
        NSNumber * temp = [iS objectAtIndex:i];
        
        [iS replaceObjectAtIndex:i withObject:[iS objectAtIndex:j]];
        
        [iS replaceObjectAtIndex:j withObject:temp];
        
    }
    
    int i = 0;
    j = 0;
    
    NSMutableString * result = [NSMutableString string];
    NSData * resultData;
    
    for (short x = 0; x < [aInput length]; x ++) {
        
        i = (i + 1) % 256;
        
        int is = [[iS objectAtIndex:i] intValue];
        
        j = (j + is) % 256;
        
        int is_i = [[iS objectAtIndex:i] intValue];
        int is_j = [[iS objectAtIndex:j] intValue]; 
        
        int t = (is_i + is_j) % 256;
        
        int iY = [[iS objectAtIndex:t] intValue];
        
        UniChar ch = (UniChar)[aInput characterAtIndex:x];
        UniChar ch_y = ch^iY;
        
        NSString * tmpStr = [NSString stringWithCharacters:&ch_y length:1];
        
        [result appendString:tmpStr];
        
    }
    

    
    resultData = [result dataUsingEncoding:NSUTF8StringEncoding];
    
    return resultData;
    
}

//读取字数
-(NSString*)read:(long long)len option:(uexFileMgrFileReadingOption)option{

	fileHandle = [NSFileHandle fileHandleForReadingAtPath:appFilePath];
	NSData *getData;
	if (fileHandle==nil) {
		return nil;
	}
	long long fileLength = [File getFileLength:appFilePath];
    if (self.keyString) {
        getData = [fileHandle readDataToEndOfFile];
        if (getData) {
            getData=[self rc4WithInput:getData key:self.keyString];
        }
    }else {
        if (len < 0 || len >= fileLength) {
            getData = [fileHandle readDataToEndOfFile];
        }else {
            getData = [fileHandle readDataOfLength:(NSUInteger)len];
        }
    }
    [fileHandle closeFile];
    NSString *result;
    if (option & uexFileMgrFileReadingOptionBase64Encoding) {
        result = [getData base64Encoding];
    }else{
        result = [[NSString alloc]initWithData:getData encoding:NSUTF8StringEncoding];
    }
	return result;
}

-(NSString *)getSize{
	//获得文件大小
	if ([File fileIsExist:appFilePath]) {
		 long long fileSize =[File getFileLength:appFilePath];
		return @(fileSize).stringValue;
	}
	return nil;
}
-(void)close{
	//关闭文件
}
-(NSString*)getFilePath{
	return  fileUrl;
}
-(long long)getReaderOffset{
	return [self.OS_offset longLongValue];
}
//precent
-(NSString*)readPercent:(NSString*)inPercent Len:(NSString *)inLen{
    long long size = [self getSize].longLongValue;
	offset = [inPercent intValue]* size /100;
	self.OS_offset = @(offset);
	return [self readFilp:F_PAGE_PERCENT len:[inLen intValue]];
}
//pre
-(NSString*)readPre:(NSString*)inLen{
	return [self readFilp:F_PAGE_PRE len:[inLen intValue]];
}
//next
-(NSString*)readNext:(NSString*)inLen{
	return [self readFilp:F_PAGE_NEXT len:[inLen intValue]];
}
//filp
-(NSString*)readFilp:(int)inType len:(int)inLen{
	NSString *readString = nil;

	if (inLen<3) {
		return nil;
	}
	if (inType==F_PAGE_PRE) {
		if (offset==0) {
			OS_offset = [NSNumber numberWithLong:0];
			return nil;
		}
		offset = offset-[currentLength longValue] - inLen;
	}
	long long fileLen = [self getSize].longLongValue;
	if (fileLen==0) {return nil;}
	if (offset>=fileLen) {return nil;}
	 
	if (inType ==F_PAGE_PERCENT) {
		if (fileLen-offset<=3) {
			offset = fileLen-3;
		}
	}

	if (offset<0) {
		offset = 0;
	}
	if (offset>=0) {
		[self seek:[NSString stringWithFormat:@"%lld",offset]];
	}
	NSData *readData = nil;
	int readLenth = inLen;
	if (fileHandle!=nil) {
		for (int i =0 ; i<6; i++) {
			readData = [fileHandle readDataOfLength:readLenth];
			readString = [[NSString alloc] initWithData:readData encoding:NSUTF8StringEncoding];
			if (readString!=nil) {
				offset +=[readData length]; 
				break;
			}else {
				readLenth-=1;
				[fileHandle seekToFileOffset:offset];
			}
		}
		int readLengthSuf = inLen;
		long long offsetSuf = offset;
		if (readString==nil) {
			for (int j = 0; j<6; j++) {
				offsetSuf-=1;
				if (offsetSuf >=0) {
					[fileHandle seekToFileOffset:offsetSuf];
					readData = [fileHandle readDataOfLength:readLengthSuf];
					readString = [[NSString alloc] initWithData:readData encoding:NSUTF8StringEncoding];
					if(readString!=nil){
						offset =offsetSuf +[readData length];
						break;
					}
				}else {
					break;
				}
			}
		}
		int readLengthPre = inLen;
		NSInteger offsetPre = (NSUInteger)offset;
		if (readString == nil) {
			for (int i = 0; i<6; i++) {
				offsetPre -=1;
				if (offsetPre<0) {
					offsetPre = 0;
				}
				for (int j = 0; j<6; j++) {
					readLengthPre+=1;
					if (offsetPre>=0) {
						[fileHandle seekToFileOffset:offsetPre];
						readData = [fileHandle readDataOfLength:readLengthPre];
						readString = [[NSString alloc] initWithData:readData encoding:NSUTF8StringEncoding];
						if (readString!=nil) {
							offset = offsetPre+[readData length];
							break;	
						} 
						
					}
				}
				if (readString!=nil) {
					break;
				}
			}
		}
	}
	if (readData) {
		self.currentLength = @([readData length]);
	}
	self.OS_offset = @(offset);

	//将读取到的数据中的换行换成<br>
	NSString *lTmp = [NSString stringWithFormat:@"%c",'\n'];
	NSString *resultStr = [readString stringByReplacingOccurrencesOfString:lTmp withString:@"<br/>&nbsp;&nbsp;"];

	return resultStr;
}
//乱码
//-(BOOL)isMessyCode:(NSString *)inStr{
//	for (int i=0; i<inStr.length; i++) {
//		char c = [inStr characterAtIndex:i];
//		if (c == 0xfffd) {
//			return YES;
//		}
//	}
//	return NO;
//}
-(void)dealloc{
	appFilePath = nil;
	if (fileUrl) {
		fileUrl = nil;
	}
    if (keyString) {
        self.keyString=nil;
    }
}
@end
