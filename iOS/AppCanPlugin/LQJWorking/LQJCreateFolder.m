//
//  LQJCreateFolder.m
//  LQJCreateFolder
//
//  Created by 罗啟杰 on 2016/12/19.
//  Copyright © 2016年 Roger. All rights reserved.
//

#import "LQJCreateFolder.h"

@implementation LQJCreateFolder

+(NSString *)createFolderAtDocument:(NSString *)name{
    NSFileManager *manager=[NSFileManager defaultManager];
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *createPath=[documentPath stringByAppendingPathComponent:name];
    
    [manager createDirectoryAtPath:createPath withIntermediateDirectories:YES attributes:nil error:nil];
    
    return createPath;
    
}

+(NSString *)createFolderAtCaches:(NSString *)name{
    NSFileManager *manager=[NSFileManager defaultManager];
    NSString *cachesPath=[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *createPath=[cachesPath stringByAppendingPathComponent:name];
    
    [manager createDirectoryAtPath:createPath withIntermediateDirectories:YES attributes:nil error:nil];
    
    return createPath;

}



+(NSString *)getDocumentSubFolderPath:(NSString *)name{
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *floderPath=[documentPath stringByAppendingPathComponent:name];
    
    return floderPath;
}

+(NSString *)getCachesSubFolderPath:(NSString *)name{
    NSString *cachesPath=[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *floderPath=[cachesPath stringByAppendingPathComponent:name];
    
    return floderPath;
}


//拷贝文件
+(BOOL)copyMissingFile:(NSString *)sourcePath toPath:(NSString *)toPath
{
    BOOL retVal = YES; // If the file already exists, we'll return success…
    NSString * finalLocation = [toPath stringByAppendingPathComponent:[sourcePath lastPathComponent]];
    if (![[NSFileManager defaultManager] fileExistsAtPath:finalLocation])
    {
        retVal = [[NSFileManager defaultManager] copyItemAtPath:sourcePath toPath:finalLocation error:NULL];
    }
    return retVal;
}

+(NSString *)copyPicture:(UIImage *)picture toPath:(NSString *)path{
    BOOL retVal = YES;
    NSData *data=UIImageJPEGRepresentation(picture, 1);
    NSString *nameStr = [[NSUUID UUID] UUIDString];
    

    NSString *filePath = [path stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.jpg", nameStr]];  // 保存文件的名称

    
    retVal =[data writeToFile:filePath atomically:YES]; // 保存成功会返回YES
    
    
    return filePath;
}




//-(NSString *)intitleToFileByKey:(NSString *)key andType:(NSString *)type{
//    NSString *temp;
//    
//    [[NSUserDefaults standardUserDefaults]setObject:temp forKey:key];
//    
//    
//
//}



@end
