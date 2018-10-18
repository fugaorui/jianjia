//
//  LQJViewController.m
//  test
//
//  Created by 罗啟杰 on 2017/2/15.
//  Copyright © 2017年 Roger. All rights reserved.
//

#import "LQJViewController.h"
#import "LQJCreateFolder.h"


@interface LQJViewController ()<UIWebViewDelegate,UIScrollViewDelegate,UIGestureRecognizerDelegate>
{
    UIButton *btn;
}
@property(nonatomic,strong)UIWebView *webV;

@end

@implementation LQJViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    
    NSLog(@"%@",self.filePath);
    
    NSURL *url=[NSURL fileURLWithPath:self.filePath];
    
    NSURLRequest *request=[NSURLRequest requestWithURL:url];
    
    self.view.frame=CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    
    self.webV=[[UIWebView alloc]init];
    _webV.frame=CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    _webV.autoresizingMask=UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
    _webV.scalesPageToFit=YES;
    _webV.multipleTouchEnabled=YES;
    _webV.userInteractionEnabled=YES;

    


    btn=[[UIButton alloc]initWithFrame:CGRectMake([UIScreen mainScreen].bounds.size.width-40, [UIScreen mainScreen].bounds.size.height-30, 40, 30)];
    [btn setBackgroundColor:[UIColor grayColor]];
    [btn setTitle:@"返回" forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(tapAction:) forControlEvents:UIControlEventTouchUpInside];
    

    [_webV loadRequest:request];
    [_webV addSubview:btn];
    [self.view addSubview:_webV];
    
    
}


-(void)deleteFile{
    
    NSFileManager *mgr=[NSFileManager defaultManager];
    BOOL success=[mgr removeItemAtPath:_filePath error:nil];
    NSLog(@"%d",success);
    

}


-(void)tapAction:(UITapGestureRecognizer *)sender{
//    [self dismissViewControllerAnimated:YES completion:nil];
    
    [self dismissViewControllerAnimated:NO completion:^{
//        [self deleteFile];
    }];
    

}





- (BOOL)prefersStatusBarHidden {
    return YES;
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
