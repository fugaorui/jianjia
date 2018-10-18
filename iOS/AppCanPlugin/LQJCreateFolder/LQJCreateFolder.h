//
//  LQJCreateFolder.h
//  LQJCreateFolder
//
//  Created by 罗啟杰 on 2016/12/19.
//  Copyright © 2016年 Roger. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface LQJCreateFolder : NSObject


+(NSString *)createFolderAtDocument:(NSString *)name;
+(NSString *)createFolderAtCaches:(NSString *)name;

+(NSString *)getDocumentSubFolderPath:(NSString *)name;
+(NSString *)getCachesSubFolderPath:(NSString *)name;


@end
